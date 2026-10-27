import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { defaultOpening } = loadSource("src/lib/events/celebration.ts");
const { openingPresets, resolvedOpening } = loadSource(
  "src/lib/events/opening-presets.ts",
);
const { default: Scene } = loadSource(
  "src/features/invitations/opening-scene.tsx",
);
test("six opening scenes expose different themed artwork and a complete shared timeline", () => {
  const markers = [
    "opening-pocket",
    "opening-door",
    "opening-ticket-main",
    "opening-curtain",
    "opening-petals",
    "opening-orbit",
  ];
  assert.equal(openingPresets.length, 6);
  const scenes = openingPresets.map((preset, index) => {
    const html = renderToStaticMarkup(
      createElement(Scene, {
        opening: { ...defaultOpening(true), style: preset.id },
        title: "Nuestra boda",
        wedding: true,
        photoURL: () => "",
        phase: "opening",
        onOpen() {},
        preview: true,
      }),
    );
    assert.match(html, new RegExp(markers[index]));
    assert.ok(html.includes(`--opening-duration:${preset.duration}ms`));
    assert.match(html, /data-phase="opening"/);
    assert.ok(preset.duration >= 1600 && preset.duration <= 2000);
    return html;
  });
  assert.equal(new Set(scenes).size, 6);
});
test("automatic palettes follow the first canvas and keep the accent legible", () => {
  const event = {
    kind: "wedding",
    opening: defaultOpening(true),
    accentColor: "#435B48",
    sections: [{ canvas: { background: "#FFF9ED" } }],
  };
  const first = resolvedOpening(event);
  assert.equal(first.color, "#FFF9ED");
  assert.equal(first.ink, "#435B48");
  event.sections[0].canvas.background = "#10231F";
  assert.equal(resolvedOpening(event).color, "#10231F");
  assert.equal(resolvedOpening(event).ink, "#FFF9ED");
  assert.equal(event.opening.color, "#F4EBDF");
});
test("custom and legacy palettes survive template changes without changing the canvas", () => {
  for (const paletteMode of [undefined, "custom"]) {
    const opening = {
      ...defaultOpening(false),
      color: "#ABCDEF",
      ink: "#123456",
      paletteMode,
    };
    const event = {
      kind: "general",
      opening,
      accentColor: "#FFFFFF",
      sections: [{ canvas: { background: "#000000" } }],
    };
    assert.equal(resolvedOpening(event), opening);
    assert.equal(event.sections[0].canvas.background, "#000000");
  }
});
test("custom icons and the explicit no-icon choice carry through every themed scene", () => {
  const { default: Artwork } = loadSource(
    "src/features/invitations/opening-artwork.tsx",
  );
  for (const preset of openingPresets) {
    const html = renderToStaticMarkup(
      createElement(Artwork, {
        opening: {
          ...defaultOpening(true),
          style: preset.id,
          sealIcon: "none",
        },
        title: "Boda",
        wedding: true,
      }),
    );
    assert.ok(!html.includes("opening-seal"));
    const custom = renderToStaticMarkup(
      createElement(Artwork, {
        opening: {
          ...defaultOpening(true),
          style: preset.id,
          sealIcon: "heart",
        },
        title: "Boda",
        wedding: true,
      }),
    );
    assert.ok(custom.includes("opening-seal"));
  }
});

test("the preview and guest timeline completes, prevents double activation and respects reduced motion", () => {
  for (const reduced of [false, true])
    for (const preset of openingPresets) {
      let phase = "closed",
        cursor = 0,
        callback,
        duration,
        calls = 0;
      const refs = [];
      const { useOpeningAnimation: animationHook } = loadSource(
        "src/features/invitations/use-opening-animation.ts",
        {
          mocks: {
            react: {
              useState: () => [
                phase,
                (next) => {
                  phase = next;
                },
              ],
              useRef(value) {
                const index = cursor++;
                return (refs[index] ||= { current: value });
              },
              useEffect() {},
            },
          },
          globals: {
            setTimeout(fn, ms) {
              callback = fn;
              duration = ms;
              calls++;
              return calls;
            },
            clearTimeout() {},
          },
        },
      );
      const render = () => {
        cursor = 0;
        return animationHook(preset.id);
      };
      const node = {
        ownerDocument: {
          defaultView: { matchMedia: () => ({ matches: reduced }) },
        },
      };
      render().open(node);
      render().open(node);
      assert.equal(calls, 1);
      assert.equal(render().phase, "opening");
      assert.equal(duration, reduced ? 0 : preset.duration);
      callback();
      assert.equal(render().phase, "done");
      render().reset();
      assert.equal(render().phase, "closed");
      render().open(node);
      assert.equal(calls, 2);
    }
});
