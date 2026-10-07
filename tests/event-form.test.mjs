import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { suggestedAddress } = loadSource("src/lib/events/event-form.ts");
test("event names suggest valid, readable addresses without accents or spaces", () => {
  assert.equal(suggestedAddress("Sofía y Mateo"), "sofiaymateo");
  assert.equal(suggestedAddress("Sofía & Mateo"), "sofiaymateo");
  assert.equal(suggestedAddress("Cumpleaños de Lucas"), "cumpleanosdelucas");
  assert.equal(suggestedAddress("--- Fiesta! ---"), "fiesta");
  assert.equal(suggestedAddress("💜"), "");
  assert.equal(suggestedAddress("a".repeat(64)).length, 63);
});
