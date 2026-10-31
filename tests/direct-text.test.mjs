import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { directTextMode, directTextChange } = loadSource(
  "src/features/designer/flyer/direct-text.ts",
);
const item = { id: "text", type: "text", text: "Original" };

test("direct editing changes text without replacing geometry or interpreting markup", () => {
  const result = directTextChange(item, {}, "Hello\n<script>text</script>");
  assert.equal(result.element.text, "Hello\n<script>text</script>");
  assert.equal(result.event, undefined);
  assert.equal(item.text, "Original");
});
test("linked names update event data and retain celebration settings", () => {
  const linked = { ...item, binding: "couple_names", eventBound: true };
  const result = directTextChange(
    linked,
    { celebration: { dressCode: "Formal", adultsOnly: true } },
    " Ana ",
    " Lucas ",
  );
  assert.equal(result.event.celebration.partnerOne, "Ana");
  assert.equal(result.event.celebration.partnerTwo, "Lucas");
  assert.equal(result.event.celebration.dressCode, "Formal");
  assert.equal(result.event.celebration.adultsOnly, true);
  assert.equal(result.element, undefined);
  assert.equal(linked.eventBound, true);
  assert.throws(() => directTextChange(linked, {}, "Ana", ""));
});
test("linked titles update the source while dates and guest placeholders stay protected", () => {
  assert.equal(
    directTextChange(
      { ...item, binding: "event_title", eventBound: true },
      {},
      " My day ",
    ).event.title,
    "My day",
  );
  assert.throws(() =>
    directTextChange(
      { ...item, binding: "event_title", eventBound: true },
      {},
      "a",
    ),
  );
  for (const binding of ["guest_name", "event_date", "gift_link", "location"]) {
    assert.equal(directTextMode({ ...item, binding, eventBound: true }), null);
  }
  assert.equal(directTextMode({ ...item, type: "image" }), null);
  assert.equal(
    directTextMode({ ...item, binding: "event_date", eventBound: false }),
    "text",
  );
});
