import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { reconcileSeatingSave } = loadSource("src/lib/events/seating-save.ts");

test("a saved seating snapshot clears dirty state only without newer edits", () => {
  const submitted = {
    version: 3,
    tables: [{ id: "table", x: 100 }],
    assignments: {},
  };
  const saved = { ...submitted, version: 4 };
  const result = reconcileSeatingSave(submitted, submitted, saved);
  assert.equal(result.plan, saved);
  assert.equal(result.dirty, false);
});

test("moving or editing a table during autosave preserves the newer draft with the committed version", () => {
  const submitted = {
    version: 3,
    tables: [{ id: "table", name: "Mesa 1", x: 100 }],
    assignments: {},
  };
  const current = {
    ...submitted,
    tables: [{ id: "table", name: "Familia", x: 200 }],
    assignments: { ana: "table" },
  };
  const saved = { ...submitted, version: 4 };
  const result = reconcileSeatingSave(current, submitted, saved);
  assert.equal(result.dirty, true);
  assert.equal(result.plan.version, 4);
  assert.equal(result.plan.tables, current.tables);
  assert.equal(result.plan.assignments, current.assignments);
  assert.equal(current.version, 3);
});
