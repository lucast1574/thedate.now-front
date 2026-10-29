import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { proposeSeating, newTable } = loadSource(
  "src/lib/events/auto-seating.ts",
);
const { emptyPlan } = loadSource("src/lib/events/seating.ts");
const guest = (id, family, fields = {}) => ({
  id,
  name: id,
  seats: 2,
  attendingSeats: 2,
  response: "going",
  family,
  companions: [{ name: "Partner" }],
  ...fields,
});

test("a possible unnamed plus one gets no table seat until registered", () => {
  const result = proposeSeating(
    [guest("a", "Amigos", { companions: [] })],
    emptyPlan(),
    { capacity: 50 },
    10,
  );
  assert.equal(Object.keys(result.plan.assignments).length, 1);
  assert.equal(result.plan.assignments["a~1"], undefined);
});
test("completion excludes pending even legacy option and keeps manual choices", () => {
  const plan = emptyPlan();
  plan.tables = [newTable(0, 3, "round", "manual")];
  plan.assignments = {
    "a~0": "manual",
    "a~1": "manual",
    "pending~0": "manual",
  };
  const guests = [
    guest("a", "Amigos"),
    guest("b", "Amigos"),
    guest("pending", "Amigos", { response: "pending" }),
    guest("maybe", "Amigos", { response: "maybe" }),
    guest("c", "Familia de la novia"),
  ];
  const result = proposeSeating(guests, plan, { capacity: 50 }, 10, true).plan;
  assert.equal(result.assignments["a~0"], "manual");
  assert.equal(result.assignments["pending~0"], undefined);
  assert.equal(result.assignments["maybe~0"], undefined);
  assert.equal(result.assignments["b~0"], result.assignments["b~1"]);
  assert.notEqual(result.assignments["b~0"], "manual");
  assert.notEqual(result.assignments["b~0"], result.assignments["c~0"]);
  assert.equal(result.tables.length, 3);
  assert.equal(plan.assignments["pending~0"], "manual");
});
