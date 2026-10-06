import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { invitationTemplates, resolveTemplateId } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { applyTemplate } = loadSource("src/features/designer/templates.ts", {
  globals: { crypto },
});
const { designPayload } = loadSource("src/features/designer/design-state.ts");
const Icon = loadSource("src/components/icon.tsx").default;
test("catalog and saved designs keep concrete product-specific template IDs", () => {
  assert.equal(invitationTemplates.length, 12);
  assert.equal(new Set(invitationTemplates.map((t) => t.id)).size, 12);
  for (const kind of ["general", "wedding"])
    for (const mode of ["sections", "flyer"])
      assert.equal(
        invitationTemplates.filter((t) => t.kind === kind && t.mode === mode)
          .length,
        3,
      );
  const draft = {
    kind: "wedding",
    title: "Our wedding",
    description: "Hello",
    template: "classic",
    accentColor: "#9c6449",
    photoKeys: [],
    sections: [],
  };
  const romance = invitationTemplates.find(
    (t) => t.id === "wedding-sections-romance",
  );
  const saved = designPayload(applyTemplate(draft, romance));
  assert.equal(saved.templateId, romance.id);
  const wrong = invitationTemplates.find((t) => t.id === "general-classic");
  assert.equal(applyTemplate(draft, wrong), draft);
  assert.equal(
    resolveTemplateId("general", "modern", "flyer", "wedding-flyer-night"),
    "general-flyer-party",
  );
});
test("icons are local SVG paths with stable geometry rather than platform glyphs", () => {
  for (const name of ["heart", "flower", "star", "cake", "users", "music"]) {
    const html = renderToStaticMarkup(createElement(Icon, { name }));
    assert.match(html, /<svg/);
    assert.match(html, /viewBox="0 0 24 24"/);
    assert.match(html, /<path/);
    assert.doesNotMatch(html, /😀|✨|🎂|💍/);
  }
  assert.equal(renderToStaticMarkup(createElement(Icon, { name: "none" })), "");
});
