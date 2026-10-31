import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { loadSource } from "./support/load-source.cjs";
const options = { globals: { crypto } };
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { blankEvent } = loadSource("src/lib/events/draft.ts");
const { templateSequence } = loadSource(
  "src/features/designer/template-sequence.ts",
  options,
);
const { applyCompleteTemplate } = loadSource(
  "src/features/designer/apply-template-design.ts",
  options,
);
const { default: Surface } = loadSource(
  "src/components/flyer-surface.tsx",
  options,
);
const pick = (id) => invitationTemplates.find((t) => t.id === id);
test("template families have different reading sequences and non-overlapping story text", () => {
  const flows = new Set(),
    compositions = new Set();
  for (const t of invitationTemplates.filter((t) => t.mode === "flyer")) {
    const pages = templateSequence(t);
    flows.add(
      pages
        .slice(0, 4)
        .map((s) => s.heading)
        .join("/"),
    );
    const story = pages.find((s) =>
      ["Nuestra historia", "Nos reunimos"].includes(s.heading),
    );
    const texts = story.canvas.elements.filter((e) => e.type === "text");
    for (let i = 0; i < texts.length; i++)
      for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i],
          b = texts[j];
        assert.ok(
          a.x + a.width <= b.x ||
            b.x + b.width <= a.x ||
            a.y + a.height <= b.y ||
            b.y + b.height <= a.y,
          `${t.id}: ${a.id} / ${b.id}`,
        );
      }
    compositions.add(
      JSON.stringify(
        story.canvas.elements.map((e) => [
          e.type,
          e.x,
          e.y,
          e.width,
          e.height,
          e.align,
        ]),
      ),
    );
  }
  assert.ok(flows.size >= 5);
  assert.ok(compositions.size >= 10);
});
test("interior decoration leaves the greeting clear and cover artwork keeps its original composition", () => {
  const t = pick("wedding-flyer-night"),
    pages = templateSequence(t);
  const render = (page) =>
    renderToStaticMarkup(
      createElement(Surface, {
        canvas: page.canvas,
        photoURL: () => "",
        label: page.heading,
      }),
    );
  assert.ok(!render(pages[0]).includes("art-interior"));
  const story = render(pages.find((s) => s.heading === "Nuestra historia"));
  assert.ok(story.includes("art-interior"));
  assert.ok(!story.includes("translate(360"));
});
test("switching untouched openings follows the chosen identity and explicit customization stays", () => {
  const a = applyCompleteTemplate(
    blankEvent("wedding"),
    pick("wedding-flyer-floral"),
  );
  const b = applyCompleteTemplate(a, pick("wedding-flyer-night"));
  assert.notEqual(a.opening.style, b.opening.style);
  assert.notEqual(a.opening.message, b.opening.message);
  const custom = {
    ...a.opening,
    message: "Nuestra carta personal",
    sealIcon: "heart",
  };
  assert.equal(
    applyCompleteTemplate(
      { ...a, opening: custom },
      pick("wedding-flyer-night"),
    ).opening,
    custom,
  );
  assert.equal(
    applyCompleteTemplate(
      { ...a, opening: { ...a.opening, enabled: false } },
      pick("wedding-flyer-night"),
    ).opening.enabled,
    false,
  );
});
test("photo-free covers retain distinct structures and preserved photos never obscure new text layers", () => {
  const covers = new Set();
  for (const t of invitationTemplates.filter(
    (t) => t.kind === "wedding" && t.mode === "flyer",
  )) {
    const c = applyCompleteTemplate(blankEvent("wedding"), t, false).sections[0]
      .canvas;
    covers.add(
      JSON.stringify(
        c.elements
          .filter((e) => e.type === "text")
          .map((e) => [e.x, e.y, e.width, e.height, e.align]),
      ),
    );
  }
  assert.ok(covers.size >= 12);
  const source = applyCompleteTemplate(
    blankEvent("wedding"),
    pick("wedding-flyer-floral"),
  );
  source.sections[0].canvas.elements.push({
    id: "own-photo",
    type: "image",
    photoKey: "mine.jpg",
    x: 0,
    y: 0,
    width: 720,
    height: 1280,
    font: "serif",
    fontSize: 24,
    color: "#123456",
    align: "center",
    rotation: 0,
  });
  const target = applyCompleteTemplate(source, pick("wedding-flyer-paris"));
  const e = target.sections[0].canvas.elements;
  assert.ok(
    e.findIndex((i) => i.id === "own-photo") <
      e.findIndex((i) => i.binding === "couple_names"),
  );
});

test("each product has 24 different cover compositions, beyond palette changes", () => {
  const { templateCanvas } = loadSource(
    "src/features/designer/template-canvas.ts",
    options,
  );
  for (const kind of ["wedding", "general"]) {
    const signatures = invitationTemplates
      .filter((t) => t.kind === kind && t.mode === "flyer")
      .map((t) =>
        JSON.stringify(
          templateCanvas(t).elements.map((e) => [
            e.type,
            e.x,
            e.y,
            e.width,
            e.height,
            e.align,
            e.fontSize,
          ]),
        ),
      );
    assert.equal(new Set(signatures).size, 24, kind);
  }
});

test("cover decorations have unique soft clear-space masks for authored text", () => {
  const a = templateSequence(pick("wedding-flyer-vine"))[0],
    b = templateSequence(pick("wedding-flyer-olive"))[0];
  const html = renderToStaticMarkup(
    createElement(
      "div",
      {},
      ...[a, b].map((page, n) =>
        createElement(Surface, {
          key: n,
          canvas: page.canvas,
          photoURL: () => "",
        }),
      ),
    ),
  );
  const ids = [...html.matchAll(/<mask id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 2);
  assert.equal(new Set(ids).size, 2);
  assert.ok(html.includes("feGaussianBlur"));
  for (const id of ids) assert.ok(html.includes(`mask="url(#${id})"`));
});
