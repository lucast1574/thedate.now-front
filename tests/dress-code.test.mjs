import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { dressStyles, dressParts, toggleDressPart } = loadSource(
  "src/lib/events/dress-code.ts",
);
const { default: Content } = loadSource("src/components/flyer-dress-code.tsx");
const { blankEvent, eventPayload } = loadSource("src/lib/events/draft.ts");
test("dress code supports every nonempty combination, preserves the last part and renders only selected content", () => {
  for (const style of Object.keys(dressStyles)) {
    const item = {
      dressStyle: style,
      dressIcon: "lucide:shirt",
      dressPhotoKey: "mine.png",
      text: "Cóctel · Zapatos cómodos",
      align: "left",
    };
    const html = renderToStaticMarkup(
      createElement(Content, { item, photoURL: (key) => `/private/${key}` }),
    );
    const parts = dressParts(style);
    assert.equal(
      html.includes("dress-composition-icon"),
      parts.includes("icon"),
    );
    assert.equal(html.includes("/private/mine.png"), parts.includes("image"));
    assert.equal(html.includes("Cóctel"), parts.includes("text"));
    if (parts.length === 1)
      assert.equal(toggleDressPart(style, parts[0]), style);
    for (const part of ["text", "icon", "image"])
      assert.ok(dressParts(toggleDressPart(style, part)).length > 0);
  }
  const html = renderToStaticMarkup(
    createElement(Content, {
      item: { dressStyle: "image" },
      photoURL: () => "wrong-private-url",
    }),
  );
  assert.match(html, /\/template-photos\/placeholder.svg/);
  assert.doesNotMatch(html, /wrong-private-url/);
});
test("the adults-only value, message and WhatsApp choice are sent from event creation for both brands", () => {
  for (const kind of ["wedding", "general"]) {
    const draft = blankEvent(kind);
    draft.startAt = "2027-01-01T18:00";
    assert.equal(draft.celebration.adultsOnly, false);
    draft.celebration = {
      ...draft.celebration,
      adultsOnly: true,
      adultsMessage: "Celebración sin niños.",
      whatsappNotice: true,
    };
    const payload = eventPayload(draft);
    assert.equal(payload.celebration.adultsOnly, true);
    assert.equal(payload.celebration.adultsMessage, "Celebración sin niños.");
    assert.equal(payload.celebration.whatsappNotice, true);
  }
});
