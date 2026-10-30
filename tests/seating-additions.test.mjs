import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { addSeatingItem } = loadSource("src/lib/events/seating-additions.ts");
const base = {
  version: 1,
  width: 1600,
  height: 1000,
  tables: [],
  assignments: {},
  areas: [],
};
test("quick-added tables always start circular with ten seats independently of existing table sizes", () => {
  const first = addSeatingItem(base, "table", "one");
  first.tables[0].capacity = 8;
  const next = addSeatingItem(first, "table", "two");
  assert.equal(next.tables[1].capacity, 10);
  assert.equal(next.tables[1].shape, "round");
  assert.equal(next.tables[1].rotation, 0);
  assert.equal(next.tables[0].capacity, 8);
  assert.equal(base.tables.length, 0);
  assert.equal(next.assignments, base.assignments);
});
test("quick add avoids duplicate table names after removing a table", () => {
  const first = addSeatingItem(base, "table", "one");
  first.tables[0].name = "Mesa 2";
  assert.equal(addSeatingItem(first, "table", "two").tables[1].name, "Mesa 3");
});
test("spaces are added with their preset size without changing seats and stop at the existing limit", () => {
  const next = addSeatingItem(base, "stage", "stage");
  assert.equal(next.areas[0].width, 420);
  assert.equal(next.areas[0].height, 140);
  assert.equal(next.tables, base.tables);
  assert.equal(next.assignments, base.assignments);
  assert.equal(
    addSeatingItem(
      { ...base, areas: Array(30).fill(next.areas[0]) },
      "stage",
      "more",
    ),
    null,
  );
});
