import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { defaultDemoCover, thumbnailFit } = loadSource(
  "src/lib/events/thumbnail.ts",
);
const event = {
  isDemo: true,
  kind: "general",
  title: "Una celebración inolvidable",
  description: "Edita esta invitación de muestra para probar tu estilo.",
  template: "classic",
  accentColor: "#ad7254",
  sections: [],
  photoKeys: [],
};
test("brand sample covers never replace edited designs", () => {
  assert.equal(defaultDemoCover(event), true);
  assert.equal(
    defaultDemoCover({ ...event, kind: "wedding", title: "Nuestra historia" }),
    true,
  );
  for (const patch of [
    { isDemo: false },
    { title: "Mi cumpleaños" },
    { description: "Texto propio" },
    { accentColor: "#ff0000" },
    { template: "modern" },
    { templateId: "general-sections-bold" },
    { designMode: "flyer" },
    { photoKeys: ["photo"] },
    { sections: [{ id: "section" }] },
  ])
    assert.equal(defaultDemoCover({ ...event, ...patch }), false);
});
test("thumbnail fitting keeps the complete heading and paragraph inside equally sized cards", () => {
  for (const [width, height, content] of [
    [192, 144, 360],
    [245, 183.75, 300],
    [335, 251.25, 620],
    [192, 144, 120],
  ]) {
    const fit = thumbnailFit(width, height, content);
    assert.ok(content * fit.scale <= height + 0.001);
    assert.ok(390 * fit.scale <= width + 0.001);
    assert.ok(fit.left >= 0);
    assert.ok(Math.abs(fit.left * 2 + 390 * fit.scale - width) < 0.001);
  }
});
