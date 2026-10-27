import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { restrictionExamples, toggleRestrictionSuggestion } = loadSource(
  "src/lib/events/restrictions.ts",
);
test("restriction suggestions combine, toggle independently and preserve custom text", () => {
  const pets = restrictionExamples[1].text,
    photos = restrictionExamples[3].text;
  let text = toggleRestrictionSuggestion("Mi indicación personal.", pets);
  text = toggleRestrictionSuggestion(text, photos);
  assert.equal(text, `Mi indicación personal.\n\n${pets}\n\n${photos}`);
  text = toggleRestrictionSuggestion(text, pets);
  assert.equal(text, `Mi indicación personal.\n\n${photos}`);
  assert.equal(
    toggleRestrictionSuggestion(text, photos),
    "Mi indicación personal.",
  );
});
