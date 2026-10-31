import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { templateSequence } = loadSource(
  "src/features/designer/template-sequence.ts",
  { globals: { crypto } },
);
const { applyCompleteTemplate } = loadSource(
  "src/features/designer/apply-template-design.ts",
  { globals: { crypto } },
);
const { designPayload, sameDesign } = loadSource(
  "src/features/designer/design-state.ts",
);
const { mergeDesign } = loadSource("src/features/designer/merge-design.ts");
const base = {
  id: "event",
  kind: "wedding",
  title: "Ana & Luis",
  description: "Nuestra celebración",
  photoKeys: [],
  accentColor: "#766044",
  template: "classic",
  designMode: "flyer",
  sections: [],
  location: "Lima",
  mapUrl: "https://maps.google.com/?q=Lima",
  startAt: "2027-01-01T18:00:00Z",
  timeZone: "America/Lima",
};
test("every canvas template is a complete editable invitation with bounded geometry", () => {
  for (const template of invitationTemplates.filter(
    (t) => t.mode === "flyer",
  )) {
    const pages = templateSequence(template, { ...base, kind: template.kind });
    assert.ok(pages.length >= 8 && pages.length <= 20, template.id);
    assert.equal(new Set(pages.map((s) => s.id)).size, pages.length);
    const elements = pages.flatMap((s) => s.canvas.elements);
    assert.ok(
      elements.some(
        (e) => e.type === "image" && e.photoKey.startsWith("template-"),
      ),
    );
    for (const binding of ["guest_name", "location", "dress_code"])
      assert.ok(elements.some((e) => e.binding === binding));
    for (const page of pages)
      for (const el of page.canvas.elements) {
        assert.ok(
          el.x >= 0 && el.y >= 0 && el.width >= 16 && el.height >= 16,
          template.id,
        );
        assert.ok(
          el.x + el.width <= page.canvas.width &&
            el.y + el.height <= page.canvas.height,
          `${template.id}/${page.heading}/${el.id}`,
        );
        assert.ok(el.fontSize >= 8 && el.fontSize <= 160);
      }
    assert.equal(
      elements.some((e) => e.binding === "adults_notice"),
      false,
    );
  }
});
test("applying a complete template replaces pages, respects an explicit opening opt-out and preserves user media", () => {
  const template = invitationTemplates.find(
    (t) => t.id === "wedding-flyer-paris",
  );
  const draft = {
    ...base,
    photoKeys: ["mine.jpg"],
    music: { source: "mp3", value: "mine.mp3" },
  };
  const applied = applyCompleteTemplate(draft, template);
  assert.ok(applied.sections.some((s) => s.when === "gifts"));
  assert.ok(applied.sections.some((s) => s.when === "restrictions"));
  assert.equal(applied.music, draft.music);
  assert.equal(applied.photoKeys, draft.photoKeys);
  assert.equal(applied.opening.enabled, true);
  assert.ok(
    applied.sections.some((s) =>
      s.canvas.elements.some((e) => e.photoKey === "template-photo"),
    ),
  );
  assert.equal(draft.sections.length, 0);
  const optOut = { ...applied.opening, enabled: false };
  assert.equal(
    applyCompleteTemplate({ ...draft, opening: optOut }, template).opening
      .enabled,
    false,
  );
  assert.equal(
    applyCompleteTemplate({ ...base, kind: "general" }, template).kind,
    "general",
  );
});
test("adults-only is optional and its editable section appears only when selected", () => {
  const template = invitationTemplates.find(
    (t) => t.id === "wedding-flyer-paris",
  );
  const draft = {
    ...base,
    celebration: {
      adultsOnly: true,
      adultsMessage: "Esta vez celebramos entre adultos.",
      whatsappNotice: true,
      dressCode: "Cóctel",
      dressNote: "Calzado cómodo",
    },
  };
  const applied = applyCompleteTemplate(draft, template);
  assert.equal(
    applied.sections
      .flatMap((s) => s.canvas.elements)
      .filter((e) => e.binding === "adults_notice").length,
    1,
  );
  assert.ok(
    applied.sections.some((s) =>
      s.canvas.elements.some((e) => e.text === draft.celebration.adultsMessage),
    ),
  );
  assert.ok(
    applied.sections.some((s) =>
      s.canvas.elements.some(
        (e) => e.binding === "dress_code" && e.text.includes("Cóctel"),
      ),
    ),
  );
});
test("opening and WhatsApp settings participate in dirty state, save and concurrent refresh merge", () => {
  const template = invitationTemplates.find(
    (t) => t.id === "wedding-flyer-paris",
  );
  const initial = applyCompleteTemplate(base, template);
  const edited = {
    ...initial,
    opening: { ...initial.opening, color: "#123456" },
    celebration: {
      ...initial.celebration,
      adultsOnly: true,
      whatsappNotice: true,
    },
  };
  assert.equal(sameDesign(initial, edited), false);
  assert.equal(designPayload(edited).opening.color, "#123456");
  assert.equal(designPayload(edited).celebration.whatsappNotice, true);
  const merged = mergeDesign(edited, initial, {
    ...initial,
    photoKeys: ["uploaded.png"],
  });
  assert.equal(merged.opening.color, "#123456");
  assert.equal(merged.celebration.adultsOnly, true);
  assert.ok(merged.photoKeys.includes("uploaded.png"));
});
