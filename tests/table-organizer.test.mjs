import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { tableHouseholds, moveTableHousehold } = loadSource(
  "src/lib/events/table-households.ts",
);
const people = [
  {
    id: "g~0",
    guestId: "g",
    slot: 0,
    name: "Ana",
    lastName: "Rojas",
    family: "Familia",
    gender: "woman",
    registered: true,
    response: "going",
  },
  {
    id: "g~1",
    guestId: "g",
    slot: 1,
    name: "Luis",
    lastName: "Perez",
    family: "Familia",
    gender: "man",
    registered: true,
    response: "going",
  },
  {
    id: "h~0",
    guestId: "h",
    slot: 0,
    name: "Maria",
    lastName: "Vega",
    family: "Amigos",
    gender: "woman",
    registered: true,
    response: "going",
  },
];
const table = {
  id: "one",
  name: "Mesa 1",
  capacity: 3,
  shape: "round",
  x: 50,
  y: 50,
  rotation: 0,
};
const plan = {
  version: 1,
  width: 1600,
  height: 1000,
  tables: [table, { ...table, id: "two", name: "Mesa 2" }],
  assignments: { "g~0": "two", "g~1": "two", "h~0": "one" },
};
test("searching an accompanying guest finds their whole invitation", () => {
  const groups = tableHouseholds(people, plan, table, 3, "Luis");
  assert.equal(groups.length, 1);
  assert.equal(groups[0].members.length, 2);
  assert.equal(groups[0].members[0].name, "Ana");
  assert.deepEqual(Array.from(groups[0].elsewhere), ["Mesa 2"]);
});
test("moving an invitation keeps its party together without changing positions or unrelated guests", () => {
  const next = moveTableHousehold(people, plan, table, 3, "g", true);
  assert.equal(next.assignments["g~0"], "one");
  assert.equal(next.assignments["g~1"], "one");
  assert.equal(next.assignments["h~0"], "one");
  assert.equal(next.tables, plan.tables);
  assert.equal(plan.assignments["g~0"], "two");
  const removed = moveTableHousehold(people, next, table, 3, "g", false);
  assert.equal(removed.assignments["g~0"], undefined);
  assert.equal(removed.assignments["g~1"], undefined);
  assert.equal(removed.assignments["h~0"], "one");
});
test("a group cannot be split to fit the last available seat or exceed event capacity", () => {
  const small = { ...table, capacity: 2 };
  assert.equal(moveTableHousehold(people, plan, small, 3, "g", true), null);
  const unassigned = { ...plan, assignments: { "h~0": "one" } };
  assert.equal(
    moveTableHousehold(people, unassigned, table, 2, "g", true),
    null,
  );
  assert.equal(
    tableHouseholds(people, unassigned, table, 3, "", "unassigned").length,
    1,
  );
});
test("table inspector presents a party as one accessible assignment control", () => {
  const Inspector = loadSource(
    "src/features/manager/table-inspector.tsx",
  ).default;
  const html = renderToStaticMarkup(
    React.createElement(Inspector, {
      table,
      plan,
      people,
      limit: 3,
      onChange() {},
      onDelete() {},
    }),
  );
  assert.equal((html.match(/type="checkbox"/g) || []).length, 0);
  assert.doesNotMatch(html, /Quitar de esta mesa/);
  assert.doesNotMatch(html, /Ver invitados/);
  assert.doesNotMatch(html, /<details/);
  assert.doesNotMatch(html, /Ana Rojas/);
  assert.doesNotMatch(html, /Luis Perez/);
  assert.doesNotMatch(html, /table-position-details|type="range"|Posici/);
});
test("saving and Excel export follow the unchanged canvas in the editor", () => {
  const Editor = loadSource("src/features/manager/seating-editor.tsx", {
    mocks: {
      "./seating-canvas": {
        default: () =>
          React.createElement("div", { "data-canvas": "protected" }, "Canvas"),
      },
    },
  }).default;
  const html = renderToStaticMarkup(
    React.createElement(Editor, {
      event: { capacity: 3 },
      guests: [],
      plan,
      busy: false,
      dirty: true,
      stale: false,
      exportAction: React.createElement("button", null, "Export workbook"),
      onChange() {},
      autosave: { saving: false, failed: false, retry() {} },
      onReload() {},
    }),
  );
  assert.ok(
    html.indexOf("Organiza tu salón") < html.indexOf('data-canvas="protected"'),
  );
  assert.match(html, /seating-workspace-wide/);
  assert.ok(
    html.indexOf('data-canvas="protected"') <
      html.indexOf("Guardando cambios automáticamente"),
  );
  assert.ok(
    html.indexOf("Guardando cambios automáticamente") <
      html.indexOf("Export workbook"),
  );
});

test("the compact table popover exposes one action for the entire household", () => {
  const Popover = loadSource(
    "src/features/manager/table-guest-popover.tsx",
  ).default;
  const html = renderToStaticMarkup(
    React.createElement(Popover, {
      table: plan.tables[1],
      plan,
      people,
      limit: 3,
      onChange() {},
      onClose() {},
    }),
  );
  assert.match(html, /Ana Rojas/);
  assert.match(html, /Luis Perez/);
  assert.equal((html.match(/aria-label="Quitar a /g) || []).length, 1);
  assert.match(html, /Quitar a Ana Rojas y su grupo/);
  assert.doesNotMatch(html, /<dialog/);
});

test("removing a legacy split household releases the entire group, preserving other guests", () => {
  assert.equal(moveTableHousehold(people, plan, table, 3, "g", false), null);
  const split = {
    ...plan,
    assignments: { "g~0": "one", "g~1": "two", "h~0": "two" },
  };
  const next = moveTableHousehold(people, split, table, 3, "g", false);
  assert.equal(next.assignments["g~0"], undefined);
  assert.equal(next.assignments["g~1"], undefined);
  assert.equal(next.assignments["h~0"], "two");
  assert.equal(split.assignments["g~1"], "two");
});
