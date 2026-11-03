import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const options = { globals: { crypto } };
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { templateSequence } = loadSource(
  "src/features/designer/template-sequence.ts",
  options,
);
const { templatePhotoVariant } = loadSource(
  "src/features/designer/template-photo-variant.ts",
  options,
);
const { intersects } = loadSource(
  "src/features/designer/editable-ornaments.ts",
  options,
);
test("all catalog pages reserve separate space for photographs, text and automatic ornaments", () => {
  for (const t of invitationTemplates.filter((t) => t.mode === "flyer")) {
    for (const photos of [true, false]) {
      const pages = templatePhotoVariant(
        templateSequence(t),
        photos,
        t.accent,
        t,
      );
      for (const page of pages) {
        const elements = page.canvas.elements;
        for (const photo of elements.filter(
          (e) => e.type === "image" && e.photoTreatment !== "cinema",
        )) {
          for (const text of elements.filter((e) => e.type === "text")) {
            assert.ok(
              !intersects(photo, text, 0),
              `${t.id}/${page.heading}: ${photo.id} crosses ${text.id}`,
            );
          }
        }
        for (const art of elements.filter((e) =>
          e.id.startsWith("ornament-"),
        )) {
          for (const content of elements.filter((e) => e.type !== "icon")) {
            assert.ok(
              !intersects(art, content, 0),
              `${t.id}/${page.heading}: decoration crosses content`,
            );
          }
        }
      }
    }
  }
});
