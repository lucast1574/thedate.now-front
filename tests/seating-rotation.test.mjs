import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { turnSeatingItem } = loadSource("src/lib/events/rotation.ts");
test("rotation stays within server bounds across repeated turns and reverses correctly", () => {
  let angle = 0;
  for (let i = 0; i < 24; i++) {
    angle = turnSeatingItem(angle, 15);
    assert.ok(angle >= -180 && angle <= 180);
  }
  assert.equal(angle, 0);
  assert.equal(turnSeatingItem(180, 15), -165);
  assert.equal(turnSeatingItem(-180, -15), 165);
  assert.equal(turnSeatingItem(turnSeatingItem(45, -15), 15), 45);
});
test("venue rotation is rendered and survives moving without changing size", () => {
  const { moveVenueArea } = loadSource("src/lib/events/venue-areas.ts");
  const VenueAreas = loadSource("src/features/manager/venue-areas.tsx").default;
  const area = {
    id: "stage",
    name: "Escenario",
    kind: "stage",
    x: 200,
    y: 200,
    width: 420,
    height: 140,
    rotation: 45,
  };
  const moved = moveVenueArea(area, 400, 300, 1600, 1000);
  assert.equal(moved.rotation, 45);
  assert.equal(moved.width, 420);
  assert.equal(area.x, 200);
  const html = renderToStaticMarkup(
    React.createElement(VenueAreas, {
      areas: [moved],
      width: 1600,
      height: 1000,
      selected: "stage",
      onSelect() {},
      onMove() {},
    }),
  );
  assert.match(html, /rotate\(45deg\)/);
});

test("table and its count rotate together", () => {
  const Canvas = loadSource("src/features/manager/seating-canvas.tsx").default;
  const plan = {
    width: 1600,
    height: 1000,
    version: 1,
    tables: [
      {
        id: "one",
        name: "Mesa 1",
        shape: "round",
        capacity: 10,
        x: 50,
        y: 50,
        rotation: 90,
      },
    ],
    assignments: {},
  };
  const html = renderToStaticMarkup(
    React.createElement(Canvas, {
      plan,
      people: [],
      selected: "one",
      onSelect() {},
      onMove() {},
    }),
  );
  assert.match(
    html,
    /class="seating-table is-selected" style="[^"]*transform:rotate\(90deg\)/,
  );
  assert.match(html, /class="table-seat-count">0\/10<\/span>/);
  assert.doesNotMatch(html, /class="table-shape table-round" style=/);
});
