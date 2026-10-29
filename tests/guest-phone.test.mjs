import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { loadSource } from "./support/load-source.cjs";
const { guestPhone, phoneCountries, splitInternationalPhone } = loadSource(
  "src/lib/events/guest-phone.ts",
);
const { collectGuestRows } = loadSource("src/lib/events/guest-rows.ts");
const { readGuestFileReport } = loadSource(
  "src/lib/events/guest-spreadsheet.ts",
  { globals: { TextDecoder } },
);

test("country-aware phones normalize formatting and reject incorrect national numbers", () => {
  assert.equal(guestPhone("925 431 535", "PE"), "+51925431535");
  assert.equal(guestPhone("+51 925 431 535"), "+51925431535");
  assert.equal(guestPhone("612 345 678", "ES"), "+34612345678");
  assert.equal(guestPhone("(202) 555-0123", "US"), "+12025550123");
  for (const bad of [
    "123",
    "98765oops",
    "+51+925431535",
    "000000000",
    "9254315351234",
  ])
    assert.throws(() => guestPhone(bad, "PE"), /WhatsApp/);
  assert.throws(() => guestPhone("925431535"), /país/);
  assert.equal(splitInternationalPhone("+34 612 345 678").country, "ES");
  assert.equal(phoneCountries.length, 21);
  assert.ok(phoneCountries.some((country) => country.code === "US"));
  assert.ok(phoneCountries.some((country) => country.code === "ES"));
  assert.ok(phoneCountries.some((country) => country.code === "PR"));
  assert.ok(
    !phoneCountries.some((country) =>
      ["BR", "FR", "CN"].includes(country.code),
    ),
  );
  assert.equal(splitInternationalPhone("+33 6 12 34 56 78"), undefined);
});

test("valid rows continue in file order and invalid rows report their original Excel row", () => {
  const report = collectGuestRows([
    ["Nombre", "WhatsApp", "País", "¿Puede llevar +1?", "Categoría"],
    ["Ana", "925431535", "PE", "Sí", "Amigos"],
    ["Bad phone", "123", "PE", "No", "Amigos"],
    ["", "945003093", "PE", "No", "Amigos"],
    ["Luis", "612345678", "ES", "No", "Amigos"],
    ["Invalid category", "943124510", "PE", "Sí", "Un grupo inventado"],
    ["", "", "PE", "", ""],
  ]);
  assert.deepEqual(
    Array.from(report.guests, (g) => g.name),
    ["Ana", "Luis"],
  );
  assert.deepEqual(
    Array.from(report.issues, (i) => i.row),
    [3, 4, 6],
  );
  assert.match(report.issues[0].message, /WhatsApp/);
  assert.match(report.issues[1].message, /Nombre/);
});

test("distributed workbook inherits first country without trusting formula caches and allows individual overrides", async () => {
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(
    await readFile("public/templates/plantilla-invitados.xlsx"),
  );
  const sheet = book.worksheets[0];
  assert.equal(book.worksheets[1].state, "hidden");
  assert.equal(book.worksheets[1].rowCount, 22);
  assert.equal(
    sheet.getCell("D11").dataValidation.formulae[0],
    "PaisesTelefonicos",
  );
  sheet.getCell("B11").value = "Ana";
  sheet.getCell("D5").value = "España (+34)";
  sheet.getCell("E11").value = "612345678";
  sheet.getCell("B12").value = "Luis";
  sheet.getCell("E12").value = "622345678";
  sheet.getCell("B13").value = "Peruvian";
  sheet.getCell("D13").value = "Perú (+51)";
  sheet.getCell("E13").value = "925431535";
  sheet.getCell("B14").value = "Invalid";
  sheet.getCell("E14").value = "123";
  sheet.getCell("B15").value = {
    formula: 'HYPERLINK("https://example.com","unsafe")',
  };
  sheet.getCell("B16").value = "Bad formula";
  sheet.getCell("D16").value = { formula: "UPPER(D5)", result: "España (+34)" };
  const bytes = new Uint8Array(await book.xlsx.writeBuffer());
  const report = await readGuestFileReport({
    name: "test.xlsx",
    size: bytes.length,
    arrayBuffer: async () => bytes.buffer,
  });
  assert.deepEqual(
    Array.from(report.guests, (g) => g.phone),
    ["+34612345678", "+34622345678", "+51925431535"],
  );
  assert.deepEqual(
    Array.from(report.issues, (i) => i.row),
    [14, 15, 16],
  );
});

test("blank template has no preset country or phantom guests and Colombia can be the main country", async () => {
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(
    await readFile("public/templates/plantilla-invitados.xlsx"),
  );
  const sheet = book.worksheets[0];
  assert.equal(sheet.getCell("D5").value, "Selecciona un país");
  assert.equal(sheet.getCell("A11").value, null);
  const read = async () => {
    const bytes = new Uint8Array(await book.xlsx.writeBuffer());
    return readGuestFileReport({
      name: "test.xlsx",
      size: bytes.length,
      arrayBuffer: async () => bytes.buffer,
    });
  };
  const blank = await read();
  assert.equal(blank.guests.length, 0);
  assert.equal(blank.issues.length, 0);
  sheet.getCell("B11").value = "Ana";
  sheet.getCell("E11").value = "3001234567";
  assert.match((await read()).issues[0].message, /País/);
  sheet.getCell("D5").value = "Colombia (+57)";
  const colombia = await read();
  assert.equal(colombia.guests.length, 1);
  assert.equal(colombia.issues.length, 0);
  assert.equal(colombia.guests[0].phone, "+573001234567");
});

test("country defaults still import when Excel saves them as shared formulas", async () => {
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(
    await readFile("public/templates/plantilla-invitados.xlsx"),
  );
  const sheet = book.worksheets[0];
  sheet.getCell("D5").value = "Colombia (+57)";
  sheet.getCell("B11").value = "Ana";
  sheet.getCell("E11").value = "3001234567";
  sheet.getCell("B12").value = "Luis";
  sheet.getCell("E12").value = "3001234568";
  sheet.fillFormula("D11:D510", 'IF($B11="","",$D$5)');
  assert.ok(sheet.getCell("D12").value.sharedFormula);
  const bytes = new Uint8Array(await book.xlsx.writeBuffer());
  const report = await readGuestFileReport({
    name: "test.xlsx",
    size: bytes.length,
    arrayBuffer: async () => bytes.buffer,
  });
  assert.equal(report.issues.length, 0);
  assert.deepEqual(
    Array.from(report.guests, (guest) => guest.phone),
    ["+573001234567", "+573001234568"],
  );
});
