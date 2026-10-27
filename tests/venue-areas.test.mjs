import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { exampleVenueAreas, moveVenueArea, newVenueArea, venueAreaKinds } =
  loadSource("src/lib/events/venue-areas.ts");
const { exampleSeatingPlan } = loadSource("src/lib/events/venue-examples.ts");
test("venue preview separates snack table, bar and central dance floor without a stage from guest seating", () => {
  const areas = exampleVenueAreas();
  assert.equal(areas.length, 3);
  assert.equal(new Set(areas.map((a) => a.id)).size, 3);
  for (const area of areas) {
    assert.ok(
      area.x >= 0 &&
        area.y >= 0 &&
        area.x + area.width <= 1600 &&
        area.y + area.height <= 1000,
    );
    assert.equal(area.capacity, undefined);
  }
  assert.equal(
    areas.some((area) => area.kind === "stage"),
    false,
  );
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

test("demo tables and editable venue presets fit the room without consuming attendee seats", () => {
  const plan = exampleSeatingPlan();
  assert.equal(plan.tables.length, 6);
  assert.equal(new Set(plan.tables.map((table) => table.id)).size, 6);
  for (const table of plan.tables) {
    assert.ok(
      table.x >= 0 && table.x <= 1360 && table.y >= 0 && table.y <= 800,
    );
  }
  for (const preset of venueAreaKinds) {
    const area = newVenueArea(preset.kind, `area-${preset.kind}`);
    assert.ok(
      area.x >= 0 &&
        area.y >= 0 &&
        area.x + area.width <= plan.width &&
        area.y + area.height <= plan.height,
    );
    assert.equal(area.capacity, undefined);
  }
  assert.ok(venueAreaKinds.some((item) => item.kind === "stage"));
});
