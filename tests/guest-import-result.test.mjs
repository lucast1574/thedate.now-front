import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { guestImportSummary } = loadSource(
  "src/lib/events/guest-import-result.ts",
);
test("reimport summary distinguishes additions, updates, unchanged guests and duplicate rows", () => {
  assert.equal(
    guestImportSummary({ added: 1, skipped: 12 }),
    "1 nuevo invitado · 12 sin cambios",
  );
  assert.equal(
    guestImportSummary({ added: 0, updated: 2, skipped: 11, duplicates: 1 }),
    "2 actualizados · 10 sin cambios · 1 fila repetida omitida",
  );
  assert.equal(guestImportSummary({ added: 0, skipped: 13 }), "13 sin cambios");
  assert.equal(
    guestImportSummary({ added: 0, skipped: 0 }),
    "No había invitados nuevos ni cambios.",
  );
});
