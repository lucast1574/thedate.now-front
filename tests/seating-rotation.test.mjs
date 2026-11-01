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

test("rotated venue areas reach each room edge without crossing it", () => {
  const { moveVenueArea } = loadSource("src/lib/events/venue-areas.ts");
  for (const rotation of [0, 15, 45, 90, -90, 135, 180, -45]) {
    const area = {
      id: "stage",
      name: "Escenario",
      kind: "stage",
      x: 200,
      y: 200,
      width: 420,
      height: 140,
      rotation,
    };
    for (const [x, y] of [
      [-9999, -9999],
      [9999, -9999],
      [-9999, 9999],
      [9999, 9999],
    ]) {
      const moved = moveVenueArea(area, x, y, 1600, 1000);
      const angle = (rotation * Math.PI) / 180;
      const corners = [
        [-210, -70],
        [210, -70],
        [-210, 70],
        [210, 70],
      ].map(([dx, dy]) => ({
        x: moved.x + 210 + dx * Math.cos(angle) - dy * Math.sin(angle),
        y: moved.y + 70 + dx * Math.sin(angle) + dy * Math.cos(angle),
      }));
      for (const point of corners) {
        assert.ok(point.x >= -1e-7 && point.x <= 1600 + 1e-7);
        assert.ok(point.y >= -1e-7 && point.y <= 1000 + 1e-7);
      }
      const edgeX =
        x < 0
          ? Math.min(...corners.map((p) => p.x))
          : Math.max(...corners.map((p) => p.x));
      const edgeY =
        y < 0
          ? Math.min(...corners.map((p) => p.y))
          : Math.max(...corners.map((p) => p.y));
      assert.ok(Math.abs(edgeX - (x < 0 ? 0 : 1600)) < 1e-7);
      assert.ok(Math.abs(edgeY - (y < 0 ? 0 : 1000)) < 1e-7);
      assert.equal(moved.rotation, rotation);
      assert.deepEqual(
        moveVenueArea(moved, moved.x, moved.y, 1600, 1000),
        moved,
      );
    }
  }
});
