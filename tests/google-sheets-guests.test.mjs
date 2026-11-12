import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ExcelJS from "exceljs";
import { loadSource } from "./support/load-source.cjs";

const { readGuestFileReport } = loadSource(
  "src/lib/events/guest-spreadsheet.ts",
  { globals: { TextDecoder } },
);
const { guestPhone } = loadSource("src/lib/events/guest-phone.ts");
const file = (bytes) => ({
  name: "invitados.xlsx",
  size: bytes.length,
  arrayBuffer: async () => Uint8Array.from(bytes).buffer,
});

for (const kind of ["wedding", "general"]) {
  test(`${kind}: real Google Sheets export preserves dropdowns, phones and the last template row`, async () => {
    // Native Sheets import/export, with synthetic guests and only Invitados kept.
    const bytes = await readFile(
      `tests/fixtures/guests-google-sheets-${kind}.xlsx`,
    );
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(bytes);
    assert.equal(book.worksheets.length, 1);
    const sheet = book.worksheets[0];
    assert.equal(sheet.rowCount, 1000);
    assert.equal(sheet.getColumn(10).hidden, true);
    assert.equal(sheet.getCell("E11").numFmt, "@");
    assert.equal(sheet.views[0].ySplit, 10);
    for (const address of ["D5", "D11", "D510"])
      assert.equal(
        sheet.getCell(address).dataValidation.formulae[0],
        "$J$2:$AD$2",
      );
    for (const address of ["F11", "F510", "G11", "G510"])
      assert.equal(sheet.getCell(address).dataValidation.type, "list");
    const report = await readGuestFileReport(file(bytes), kind);
    assert.deepEqual(Array.from(report.issues), []);
    assert.deepEqual(
      Array.from(report.guests, (guest) => [guest.phone, guest.seats]),
      [
        ["+51925431535", 2],
        ["+34612345678", 1],
      ],
    );
    assert.equal(
      report.guests[0].family,
      kind === "general" ? "Compañeros de estudios" : "Familia de la novia",
    );
  });
}

test("phone formatting controls and Unicode separators do not change the digits", () => {
  for (const value of [
    "\u200e925431535\u200b",
    "925\u00a0431\u202f535",
    "925\u2011431\u2011535",
    "９２５４３１５３５",
  ])
    assert.equal(guestPhone(value, "PE"), "+51925431535");
  for (const value of ["925letters431535", "925431535 ext 2", "+51+925431535"])
    assert.throws(() => guestPhone(value, "PE"), /WhatsApp/);
});

test("blank Google Sheets rows do not consume the 500-guest allowance", async () => {
  const book = new ExcelJS.Workbook();
  const sheet = book.addWorksheet("Invitados");
  sheet.addRow(["Nombre", "WhatsApp", "País"]);
  for (let i = 0; i < 500; i++)
    sheet.addRow(["Invitado de prueba", "925431535", "PE"]);
  sheet.getRow(1000).height = 20;
  const report = await readGuestFileReport(file(await book.xlsx.writeBuffer()));
  assert.equal(report.guests.length, 500);
  sheet.getCell("A1000").value = "Invitado adicional";
  sheet.getCell("B1000").value = "925431535";
  sheet.getCell("C1000").value = "PE";
  const overflow = file(await book.xlsx.writeBuffer());
  await assert.rejects(() => readGuestFileReport(overflow), /500 invitados/);
});
