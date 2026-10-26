import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { templateCanvas } = loadSource(
  "src/features/designer/template-canvas.ts",
  { globals: { crypto } },
);
const { applyTemplateToSection } = loadSource(
  "src/features/designer/templates.ts",
  { globals: { crypto } },
);
const { sectionIcons } = loadSource("src/lib/events/section-icons.ts");

test("all 24 canvas designs have valid, editable and distinct compositions", () => {
  const designs = invitationTemplates.filter((item) => item.mode === "flyer");
  assert.equal(designs.length, 24);
  const signatures = new Set();
  for (const template of designs) {
    const canvas = templateCanvas(template);
    assert.ok(canvas.elements.length >= 3);
    assert.equal(
      new Set(canvas.elements.map((item) => item.id)).size,
      canvas.elements.length,
    );
    for (const item of canvas.elements) {
      assert.ok(
        item.x >= 0 && item.y >= 0 && item.width >= 16 && item.height >= 16,
        template.id,
      );
      assert.ok(
        item.x + item.width <= canvas.width &&
          item.y + item.height <= canvas.height,
        template.id,
      );
      assert.ok(item.fontSize >= 8 && item.fontSize <= 160, template.id);
      assert.match(item.color, /^#[0-9a-f]{6}$/i);
      if (item.type === "icon") assert.ok(sectionIcons[item.icon], item.icon);
    }
    signatures.add(JSON.stringify(canvas));
  }
  assert.equal(signatures.size, 24);
});

test("a template fills an empty page and preserves other pages, music and photos", () => {
  const other = {
    id: "other",
    icon: "none",
    heading: "Details",
    body: "My story",
    canvas: { width: 720, height: 960, background: "#ffffff", elements: [] },
  };
  const draft = {
    id: "event",
    kind: "wedding",
    title: "Ana & Luis",
    description: "Our celebration",
    template: "classic",
    accentColor: "#826148",
    photoKeys: ["ours.jpg"],
    music: { source: "mp3", value: "ours.mp3", title: "Our song" },
    sections: [
      {
        id: "empty",
        icon: "none",
        heading: "Cover",
        body: "",
        canvas: {
          width: 720,
          height: 960,
          background: "#ffffff",
          elements: [],
        },
      },
      other,
    ],
  };
  const template = invitationTemplates.find(
    (item) => item.id === "wedding-flyer-paris",
  );
  const result = applyTemplateToSection(draft, template, "empty");
  assert.ok(
    result.sections[0].canvas.elements.some(
      (item) => item.text === draft.title,
    ),
  );
  assert.ok(
    result.sections[0].canvas.elements.some(
      (item) => item.photoKey === "ours.jpg",
    ),
  );
  assert.equal(result.sections[1], other);
  assert.equal(result.music, draft.music);
  assert.equal(result.photoKeys, draft.photoKeys);
  assert.equal(draft.sections[0].canvas.elements.length, 0);
  const content = result.sections[0].canvas.elements.map(
    ({ id, x, y, width, height, rotation, text, photoKey }) => ({
      id,
      x,
      y,
      width,
      height,
      rotation,
      text,
      photoKey,
    }),
  );
  const rethemed = applyTemplateToSection(
    result,
    invitationTemplates.find((item) => item.id === "wedding-flyer-ruby"),
    "empty",
  );
  assert.deepEqual(
    rethemed.sections[0].canvas.elements.map(
      ({ id, x, y, width, height, rotation, text, photoKey }) => ({
        id,
        x,
        y,
        width,
        height,
        rotation,
        text,
        photoKey,
      }),
    ),
    content,
  );
});
