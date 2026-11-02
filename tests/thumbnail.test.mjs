import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { thumbnailFit } = loadSource("src/lib/events/thumbnail.ts");
const { default: EventGallery } = loadSource(
  "src/features/studio/event-gallery.tsx",
  {
    mocks: {
      "./use-event-recency": { useEventRecency: () => ({}) },
      "next/link": {
        default: ({ children, ...props }) =>
          React.createElement("a", props, children),
      },
      "./invitation-thumbnail": {
        default: () =>
          React.createElement("div", null, "Saved invitation preview"),
      },
    },
  },
);
test("both demo galleries keep the branded sample cover even after a canvas is saved", () => {
  for (const kind of ["general", "wedding"]) {
    for (const isDemo of [true, false]) {
      for (const sections of [
        [],
        [{ id: "saved", canvas: { elements: [] } }],
      ]) {
        const event = {
          id: "sample",
          ownerId: "owner",
          kind,
          isDemo,
          paymentStatus: isDemo ? "demo" : "paid",
          title:
            kind === "wedding"
              ? "Nuestra historia"
              : "Una celebración inolvidable",
          description:
            "Edita esta invitación de muestra para probar tu estilo.",
          template: "classic",
          templateId: `${kind}-flyer-editorial`,
          designMode: "flyer",
          sections,
          startAt: "2099-12-01T12:00:00Z",
          createdAt: "2026-11-02T12:00:00Z",
        };
        const original = JSON.stringify(event);
        const html = renderToStaticMarkup(
          React.createElement(EventGallery, {
            events: [event],
            user: { id: "owner", role: "user" },
            portal: kind,
            loading: false,
            onCreate() {},
          }),
        );
        assert.equal(html.includes(`demo-cover-${kind}`), isDemo);
        assert.equal(html.includes("Saved invitation preview"), !isDemo);
        assert.equal(html.includes("Edita esta invitación de muestra"), isDemo);
        assert.equal(JSON.stringify(event), original);
      }
    }
  }
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
