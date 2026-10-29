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
  assert.equal(phoneCountries.length, 245);
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
  assert.equal(book.worksheets[1].rowCount, 246);
  assert.equal(
    sheet.getCell("C9").dataValidation.formulae[0],
    "PaisesTelefonicos",
  );
  sheet.getCell("A9").value = "Ana";
  sheet.getCell("C9").value = "España (+34)";
  sheet.getCell("D9").value = "612345678";
  sheet.getCell("A10").value = "Luis";
  sheet.getCell("D10").value = "622345678";
  sheet.getCell("A11").value = "Peruvian";
  sheet.getCell("C11").value = "Perú (+51)";
  sheet.getCell("D11").value = "925431535";
  sheet.getCell("A12").value = "Invalid";
  sheet.getCell("D12").value = "123";
  sheet.getCell("A13").value = {
    formula: 'HYPERLINK("https://example.com","unsafe")',
  };
  sheet.getCell("A14").value = "Bad formula";
  sheet.getCell("C14").value = { formula: "UPPER(C9)", result: "España (+34)" };
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
    [12, 13, 14],
  );
});
