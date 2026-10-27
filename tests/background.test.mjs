import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { sectionBackground, newImageBackground } = loadSource(
  "src/lib/events/background.ts",
);
const { default: Surface } = loadSource("src/components/flyer-surface.tsx");
const { designPayload, sameDesign } = loadSource(
  "src/features/designer/design-state.ts",
);
const { mergeDesign } = loadSource("src/features/designer/merge-design.ts");
const image = newImageBackground("mine.jpg");
const sections = [
  {
    id: "a",
    canvas: { width: 720, height: 960, background: "#fff9ed", elements: [] },
  },
  {
    id: "b",
    canvas: { width: 600, height: 400, background: "#fff9ed", elements: [] },
  },
];
test("one continuous image is sliced by normalized section geometry without restarting at section boundaries", () => {
  const a = sectionBackground(sections, 0, image),
    b = sectionBackground(sections, 1, image);
  assert.equal(a.offset, 0);
  assert.equal(b.offset, 960 / 720);
  assert.equal(a.total, b.total);
  assert.equal(a.total, 2);
  const one = renderToStaticMarkup(
    createElement(Surface, {
      canvas: sections[0].canvas,
      backgroundSlice: a,
      photoURL: (key) => "/photos/" + key,
    }),
  );
  const two = renderToStaticMarkup(
    createElement(Surface, {
      canvas: sections[1].canvas,
      backgroundSlice: b,
      photoURL: (key) => "/photos/" + key,
    }),
  );
  assert.match(one, /top:0%;height:150%/);
  assert.ok(Math.abs(Number(two.match(/top:([-\d.]+)%/)[1]) + 200) < 0.0001);
  assert.match(two, /height:300%/);
  assert.match(two, /src="\/photos\/mine.jpg"/);
  const reversed = sectionBackground([...sections].reverse(), 0, image);
  assert.equal(reversed.offset, 0);
  assert.equal(reversed.total, 2);
});
test("a section can override the shared image or use only its color; local images also work without a shared background", () => {
  const own = newImageBackground("own.jpg");
  const custom = [
    { ...sections[0], canvas: { ...sections[0].canvas, backgroundImage: own } },
    sections[1],
  ];
  assert.equal(sectionBackground(custom, 0, image).image.photoKey, "own.jpg");
  assert.equal(sectionBackground(custom, 0, image).total, 960 / 720);
  custom[0].canvas.backgroundOverride = true;
  assert.equal(sectionBackground(custom, 0, image), undefined);
  const noImage = renderToStaticMarkup(
    createElement(Surface, {
      canvas: custom[0].canvas,
      photoURL: (key) => "/photos/" + key,
    }),
  );
  assert.ok(!noImage.includes("flyer-background"));
  custom[0].canvas.backgroundOverride = false;
  const local = renderToStaticMarkup(
    createElement(Surface, {
      canvas: custom[0].canvas,
      photoURL: (key) => "/photos/" + key,
    }),
  );
  assert.match(local, /src="\/photos\/own.jpg"/);
});
test("background images participate in save, undo comparison, clearing and refresh without losing unsaved choices", () => {
  const base = {
    id: "qa",
    kind: "wedding",
    title: "QA",
    description: "",
    template: "classic",
    accentColor: "#766044",
    designMode: "flyer",
    sections,
    photoKeys: [],
  };
  const changed = { ...base, backgroundImage: image };
  assert.equal(sameDesign(base, changed), false);
  assert.deepEqual(designPayload(changed).backgroundImage, image);
  const incoming = {
    ...base,
    title: "Saved title",
    backgroundImage: newImageBackground("server.jpg"),
  };
  assert.deepEqual(mergeDesign(changed, base, incoming).backgroundImage, image);
  assert.deepEqual(
    mergeDesign(base, base, incoming).backgroundImage,
    incoming.backgroundImage,
  );
  const cleared = designPayload({ ...base, backgroundImage: null });
  assert.equal(cleared.clearBackgroundImage, true);
  assert.equal(cleared.backgroundImage, null);
  assert.equal(sameDesign(base, { ...base, backgroundImage: null }), true);
});
