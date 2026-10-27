import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { exampleVenueAreas, moveVenueArea } = loadSource(
  "src/lib/events/venue-areas.ts",
);
test("venue preview separates snack table, bar, stage and central dance floor from guest seating", () => {
  const areas = exampleVenueAreas();
  assert.equal(areas.length, 4);
  assert.equal(new Set(areas.map((a) => a.id)).size, 4);
  for (const area of areas) {
    assert.ok(
      area.x >= 0 &&
        area.y >= 0 &&
        area.x + area.width <= 1600 &&
        area.y + area.height <= 1000,
    );
    assert.equal(area.capacity, undefined);
  }
  const dance = areas.find((a) => a.kind === "dance");
  assert.equal(dance.x + dance.width / 2, 800);
});
test("moving venue areas respects their actual size and preserves other areas", () => {
  const areas = exampleVenueAreas(),
    original = JSON.stringify(areas),
    area = areas[0];
  assert.equal(moveVenueArea(area, -100, -100, 1600, 1000).x, 0);
  const edge = moveVenueArea(area, 9999, 9999, 1600, 1000);
  assert.equal(edge.x, 1600 - area.width);
  assert.equal(edge.y, 1000 - area.height);
  assert.equal(JSON.stringify(areas), original);
});
