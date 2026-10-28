import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { parseGuestRows } = loadSource("src/lib/events/guest-rows.ts");
const { readGuestFile } = loadSource("src/lib/events/guest-spreadsheet.ts");
test("Excel counts the titular separately and allows only zero or one companion", () => {
  const parse = (count) =>
    parseGuestRows([
      ["nombre", "telefono", "acompanantes_permitidos"],
      ["Ana", "+51987654321", count],
    ]);
  assert.equal(parse("0")[0].seats, 1);
  assert.equal(parse("1")[0].seats, 2);
  assert.equal(parse("")[0].seats, 1);
  for (const invalid of ["2", "-1", "0.5", "si"])
    assert.throws(() => parse(invalid), /fila 2/);
});
test("only Excel uploads are accepted", async () => {
  await assert.rejects(
    () => readGuestFile({ name: "list.csv", size: 50 }),
    /Excel/,
  );
});
