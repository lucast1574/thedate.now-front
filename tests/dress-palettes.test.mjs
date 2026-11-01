import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const styles = [
  "fabric",
  "petal",
  "bar",
  "jewel",
  "wave",
  "ticket",
  "circle",
  "square",
  "arch",
  "diamond",
  "hexagon",
  "leaf",
  "splash",
];
const Picker = loadSource(
  "src/features/designer/flyer/dress-palette-picker.tsx",
).default;
const Colors = loadSource("src/components/dress-excluded-colors.tsx").default;
const { designPayload } = loadSource("src/features/designer/design-state.ts");
test("all thirteen flat palette presentations persist and render their selected form", () => {
  for (const style of styles) {
    const item = {
      id: "dress",
      type: "text",
      binding: "dress_code",
      dressPaletteStyle: style,
      dressExcludedColors: [{ name: "Champagne", color: "#c9b08e" }],
    };
    const payload = designPayload({
      kind: "wedding",
      template: "classic",
      sections: [{ id: "dress", canvas: { elements: [item] } }],
    });
    assert.equal(
      payload.sections[0].canvas.elements[0].dressPaletteStyle,
      style,
    );
    const html = renderToStaticMarkup(
      createElement(Colors, {
        colors: item.dressExcludedColors,
        presentation: style,
      }),
    );
    assert.ok(html.includes(`data-palette="${style}"`));
    assert.ok(html.includes("Champagne"));
    const picker = renderToStaticMarkup(
      createElement(Picker, { item, onChange: () => {} }),
    );
    assert.equal((picker.match(/aria-pressed="true"/g) || []).length, 1);
    for (const choice of styles)
      assert.ok(picker.includes(`data-palette="${choice}"`));
  }
});
test("automatic palette presentation remains tied to the invitation", () => {
  const html = renderToStaticMarkup(
    createElement(Colors, { colors: [{ name: "Blanco", color: "#ffffff" }] }),
  );
  assert.ok(html.includes('data-palette="auto"'));
});
