import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { blankEvent } = loadSource("src/lib/events/draft.ts");
const { applyCompleteTemplate } = loadSource(
  "src/features/designer/apply-template-design.ts",
  { globals: { crypto } },
);
const structure = (draft) =>
  Array.from(draft.sections, (section) => ({
    heading: section.heading,
    height: section.canvas.height,
    elements: Array.from(section.canvas.elements, (element) => ({
      key: element.id.startsWith("ornament-")
        ? element.icon
        : element.id.replace(/^[a-f0-9]{8}-/i, ""),
      type: element.type,
      binding: element.binding,
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    })),
  }));

test("repeated template changes use exactly the selected pages and layers for both products and photo variants", () => {
  for (const kind of ["wedding", "general"]) {
    const catalog = invitationTemplates.filter(
      (template) => template.kind === kind && template.mode === "flyer",
    );
    let draft = blankEvent(kind);
    for (const photos of [true, false, true]) {
      for (const template of [...catalog, ...catalog.toReversed()]) {
        const original = JSON.stringify(draft);
        const next = applyCompleteTemplate(draft, template, photos);
        const fresh = applyCompleteTemplate(blankEvent(kind), template, photos);
        assert.deepEqual(structure(next), structure(fresh), template.id);
        assert.equal(JSON.stringify(draft), original);
        draft = next;
      }
    }
  }
});

test("old extra layers, enlarged pages and unmatched sections do not leak into the selected design", () => {
  const catalog = invitationTemplates.filter(
    (template) => template.kind === "wedding" && template.mode === "flyer",
  );
  const draft = applyCompleteTemplate(blankEvent("wedding"), catalog[0]);
  const cover = draft.sections[0];
  cover.canvas.height = 2000;
  cover.canvas.elements.push(
    ...Array.from({ length: 60 }, (_, n) => ({
      ...cover.canvas.elements[0],
      id: `old-layer-${n}`,
    })),
  );
  draft.sections.push({
    ...cover,
    id: "old-section",
    heading: "Extra anterior",
  });
  const next = applyCompleteTemplate(draft, catalog.at(-1));
  const fresh = applyCompleteTemplate(blankEvent("wedding"), catalog.at(-1));
  assert.deepEqual(structure(next), structure(fresh));
});
