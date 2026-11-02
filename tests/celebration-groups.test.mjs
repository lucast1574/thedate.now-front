import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { loadSource } from "./support/load-source.cjs";
const { guestCategory, guestCategoriesFor, generalGuestCategories } =
  loadSource("src/lib/events/guest-categories.ts");
const { readGuestFileReport } = loadSource(
  "src/lib/events/guest-spreadsheet.ts",
  { globals: { TextDecoder } },
);
const { exampleSeatingPlan } = loadSource("src/lib/events/venue-examples.ts");

test("celebration groups are separate from wedding categories", () => {
  assert.equal(generalGuestCategories.length, 8);
  for (const category of generalGuestCategories)
    assert.equal(guestCategory(category, "general"), category);
  assert.equal(
    guestCategory("  COMPANEROS de ESTUDIOS ", "general"),
    "Compañeros de estudios",
  );
  assert.throws(() => guestCategory("Familia del novio", "general"), /grupo/);
  assert.throws(() => guestCategory("Vecinos", "wedding"), /categoría/);
  assert.ok(guestCategoriesFor("wedding").includes("Familia de la novia"));
});

test("the celebration seating example contains appropriate group names", () => {
  const general = exampleSeatingPlan(false),
    wedding = exampleSeatingPlan(true);
  assert.ok(general.tables.some((t) => t.name === "Compañeros de estudios"));
  assert.ok(general.tables.some((t) => t.name === "Vecinos"));
  assert.ok(
    general.tables.every((t) => !/(Sofía|Mateo|novio|novia)/.test(t.name)),
  );
  assert.ok(wedding.tables.some((t) => t.name === "Familia de Sofía"));
  assert.equal(general.tables.length, wedding.tables.length);
});

test("The Date Excel preserves country inheritance and +1 while importing its own groups", async () => {
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(
    await readFile("public/templates/plantilla-invitados-the-date.xlsx"),
  );
  const sheet = book.worksheets[0];
  assert.equal(sheet.getCell("B2").value, "The Date · Tu lista de invitados");
  assert.equal(sheet.getCell("G10").value, "Grupo");
  assert.equal(sheet.getCell("B10").fill.fgColor.argb, "FF2860CF");
  assert.equal(sheet.views[0].ySplit, 10);
  assert.equal(book.worksheets[1].state, "hidden");
  assert.equal(
    sheet.getCell("D5").dataValidation.formulae[0],
    "PaisesTelefonicos",
  );
  assert.equal(sheet.getCell("D510").formula, 'IF($B510="","",$D$5)');
  assert.ok(sheet.getCell("G5").formula.includes("_xlfn.IMAGE"));
  const options = sheet
    .getCell("G11")
    .dataValidation.formulae[0].replace(/^"|"$/g, "")
    .split(",");
  assert.deepEqual(options, Array.from(generalGuestCategories));
  sheet.getCell("D5").value = "Perú (+51)";
  for (const [row, name, phone, group] of [
    [11, "Ana", "987654321", "Compañeros de estudios"],
    [510, "Luis", "987654322", "Vecinos"],
  ]) {
    sheet.getCell("B" + row).value = name;
    sheet.getCell("E" + row).value = phone;
    sheet.getCell("F" + row).value = row === 11 ? "Sí" : "No";
    sheet.getCell("G" + row).value = group;
  }
  const bytes = new Uint8Array(await book.xlsx.writeBuffer());
  const file = {
    name: "lista.xlsx",
    size: bytes.length,
    arrayBuffer: async () => bytes.buffer,
  };
  const report = await readGuestFileReport(file, "general");
  assert.equal(report.issues.length, 0);
  assert.equal(report.guests.length, 2);
  assert.equal(report.guests[0].phone, "+51987654321");
  assert.equal(report.guests[0].seats, 2);
  assert.equal(report.guests[1].family, "Vecinos");
  const wrongProduct = await readGuestFileReport(file, "wedding");
  assert.equal(wrongProduct.guests.length, 0);
  assert.equal(wrongProduct.issues.length, 2);
});
