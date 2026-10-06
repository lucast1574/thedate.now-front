import assert from "node:assert/strict";
import test from "node:test";
import ExcelJS from "exceljs";
import { loadSource } from "./support/load-source.cjs";
// The source loader runs in a VM realm; ExcelJS checks instanceof Array in addRow.
// Normalize only that boundary so these tests exercise the actual workbook writer.
class RealmWorkbook extends ExcelJS.Workbook {
  addWorksheet(...args) {
    const sheet = super.addWorksheet(...args),
      add = sheet.addRow.bind(sheet);
    sheet.addRow = (row, ...options) => add(Array.from(row), ...options);
    return sheet;
  }
}
const excelMock = { Workbook: RealmWorkbook };
const { readGuestFile } = loadSource("src/lib/events/guest-spreadsheet.ts", {
  globals: { TextDecoder },
});
test("real Excel round trip preserves international phone strings and companions", async () => {
  const book = new ExcelJS.Workbook(),
    sheet = book.addWorksheet("Invitados");
  sheet.addRow([
    "nombre",
    "apellido",
    "telefono",
    "cupos",
    "familia",
    "acompanantes",
    "apellidos_acompanantes",
  ]);
  sheet.addRow(["Ana", "Rojas", "+51987654321", 2, "Rojas", "Luis", "Rojas"]);
  const bytes = new Uint8Array(await book.xlsx.writeBuffer());
  const rows = await readGuestFile({
    name: "lista.xlsx",
    size: bytes.length,
    arrayBuffer: async () => bytes.buffer,
  });
  assert.equal(rows[0].phone, "+51987654321");
  assert.equal(rows[0].companions[0].name, "Luis");
  assert.equal(rows[0].seats, 2);
  sheet.getCell("A2").value = {
    formula: 'HYPERLINK("https://example.com","Ana")',
  };
  const unsafe = new Uint8Array(await book.xlsx.writeBuffer());
  await assert.rejects(
    () =>
      readGuestFile({
        name: "lista.xlsx",
        size: unsafe.length,
        arrayBuffer: async () => unsafe.buffer,
      }),
    /fórmulas/,
  );
});
test("Excel template and door export create valid workbooks with no formula cells", async () => {
  let blob;
  const workbookSource = loadSource("src/lib/events/guest-spreadsheet.ts", {
    mocks: { exceljs: excelMock },
    globals: {
      Blob,
      URL: {
        createObjectURL: (b) => {
          blob = b;
          return "blob:test";
        },
        revokeObjectURL: () => {},
      },
      document: { createElement: () => ({ click() {} }) },
      setTimeout: (fn) => fn(),
    },
  });
  await workbookSource.downloadGuestTemplate("xlsx");
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(await blob.arrayBuffer());
  assert.equal(book.worksheets[0].getCell("C2").value, "+51987654321");
  assert.equal(book.worksheets[0].getCell("C2").numFmt, "@");
  const exported = loadSource("src/lib/events/door-export.ts", {
    mocks: {
      exceljs: excelMock,
      "./guest-spreadsheet": {
        downloadFile: (data) => {
          blob = new Blob([data]);
        },
      },
    },
  });
  await exported.exportDoorWorkbook(
    { kind: "wedding", title: "Ana y Luis" },
    [
      {
        id: "a",
        name: "=Danger()",
        lastName: "Rojas",
        seats: 2,
        response: "going",
        companions: [{ name: "Luis", lastName: "Rojas" }],
      },
    ],
    {
      version: 2,
      tables: [{ id: "t", name: "Mesa 1" }],
      assignments: { "a~0": "t", "a~1": "t" },
    },
  );
  const door = new ExcelJS.Workbook();
  await door.xlsx.load(await blob.arrayBuffer());
  assert.equal(door.worksheets.length, 2);
  assert.equal(door.worksheets[0].rowCount, 4);
  assert.equal(door.worksheets[0].getCell("B3").value, "=Danger()");
  assert.equal(door.worksheets[0].getCell("G4").value, "Mesa 1");
});
