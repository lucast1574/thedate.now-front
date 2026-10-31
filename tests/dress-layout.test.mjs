import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { fitDressCanvas, dressHeight } = loadSource(
  "src/lib/events/dress-layout.ts",
);
test("long dress instructions and named colors expand the canvas without overlapping the next element", () => {
  const item = {
    id: "dress",
    type: "text",
    binding: "dress_code",
    dressStyle: "icon-text",
    x: 60,
    y: 180,
    width: 600,
    height: 200,
    fontSize: 36,
    text:
      "Elegante\n" + "Nos encantará compartir este momento contigo. ".repeat(8),
    dressExcludedColors: Array.from({ length: 8 }, (_, n) => ({
      name: `Color reservado ${n}`,
      color: "#eeeeee",
    })),
  };
  const canvas = {
    width: 720,
    height: 800,
    background: "#ffffff",
    elements: [
      item,
      {
        ...item,
        id: "next",
        binding: undefined,
        y: 500,
        height: 100,
        text: "Te esperamos",
      },
    ],
  };
  const snapshot = JSON.stringify(canvas),
    result = fitDressCanvas(canvas);
  assert.equal(JSON.stringify(canvas), snapshot);
  assert.ok(result.elements[0].height >= dressHeight(item));
  assert.ok(
    result.elements[1].y >= result.elements[0].y + result.elements[0].height,
  );
  assert.ok(result.height >= result.elements[1].y + result.elements[1].height);
  assert.equal(JSON.stringify(fitDressCanvas(result)), JSON.stringify(result));
});
test("unrelated authored canvas geometry stays unchanged", () => {
  const canvas = {
    width: 720,
    height: 960,
    elements: [
      {
        id: "text",
        type: "text",
        fontSize: 36,
        width: 600,
        height: 100,
        y: 50,
      },
    ],
  };
  assert.equal(fitDressCanvas(canvas), canvas);
});

test("all template dress pages stay within the persisted canvas limits with eight colors and a long note", () => {
  const { invitationTemplates } = loadSource(
    "src/lib/events/template-catalog.ts",
  );
  const { templateSequence } = loadSource(
    "src/features/designer/template-sequence.ts",
    { globals: { crypto } },
  );
  const { blankEvent } = loadSource("src/lib/events/draft.ts");
  for (const t of invitationTemplates.filter((t) => t.mode === "flyer")) {
    const source = blankEvent(t.kind);
    source.celebration.dressNote =
      "Celebra con nosotros con un look cómodo y especial. ".repeat(6);
    source.celebration.dressExcludedColors = Array.from(
      { length: 8 },
      (_, n) => ({ name: `Tono reservado ${n}`, color: "#eee5dd" }),
    );
    const canvas = templateSequence(t, source).find(
      (s) => s.heading === "Dress code",
    ).canvas;
    assert.ok(canvas.height <= 2000, t.id);
    assert.ok(
      canvas.elements.every((e) => e.y + e.height <= canvas.height),
      t.id,
    );
    const dress = canvas.elements.find((e) => e.binding === "dress_code");
    assert.ok(dress.height >= dressHeight(dress), t.id);
  }
});

test("an explicit palette survives switching to another invitation template", () => {
  const { invitationTemplates } = loadSource(
    "src/lib/events/template-catalog.ts",
  );
  const { applyCompleteTemplate } = loadSource(
    "src/features/designer/apply-template-design.ts",
    { globals: { crypto } },
  );
  const { blankEvent } = loadSource("src/lib/events/draft.ts");
  const first = invitationTemplates.find(
      (t) => t.id === "wedding-flyer-floral",
    ),
    second = invitationTemplates.find((t) => t.id === "wedding-flyer-rose");
  const draft = applyCompleteTemplate(blankEvent("wedding"), first);
  draft.sections
    .flatMap((s) => s.canvas.elements)
    .find((e) => e.binding === "dress_code").dressPaletteStyle = "jewel";
  const changed = applyCompleteTemplate(draft, second);
  assert.equal(
    changed.sections
      .flatMap((s) => s.canvas.elements)
      .find((e) => e.binding === "dress_code").dressPaletteStyle,
    "jewel",
  );
});
