import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { validGiftLink, giftHref } = loadSource("src/lib/events/gift-link.ts");
const { default: Gift } = loadSource("src/components/flyer-gift-link.tsx");
const { default: Invitation } = loadSource(
  "src/features/invitations/invitation.tsx",
);
test("gift links preserve personal destinations, permit HTTPS lists and never render unsafe links", () => {
  for (const link of ["/regalos", "https://store.example/lista?a=1#regalos"])
    assert.ok(validGiftLink(link));
  for (const link of [
    "",
    "/regalos/token",
    "//example.com",
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com",
    "https://user:pass@example.com",
    "https://example.com/a b",
    "https://example.com\\evil",
  ]) {
    assert.equal(validGiftLink(link), false, link);
    assert.equal(giftHref({ link }), "");
    assert.ok(
      !renderToStaticMarkup(
        createElement(Gift, { item: { link, text: "Regalos" } }),
      ).includes("<a "),
    );
  }
  assert.equal(
    giftHref({ link: "/regalos" }, "/regalos/personal-token"),
    "/regalos/personal-token",
  );
  const html = renderToStaticMarkup(
    createElement(Gift, {
      item: { link: "/regalos", text: "Nuestros regalos" },
      giftURL: "/regalos/personal-token",
    }),
  );
  assert.match(html, /href="\/regalos\/personal-token"/);
  assert.match(html, /Nuestros regalos/);
});
test("gift access is authored inside the canvas and is never forced below the invitation", () => {
  const event = {
    id: "qa",
    kind: "wedding",
    title: "QA",
    template: "classic",
    accentColor: "#766044",
    photoKeys: [],
    designMode: "flyer",
    wishlistEnabled: true,
    sections: [],
  };
  const empty = renderToStaticMarkup(
    createElement(Invitation, { event, showOpening: false, showBrand: false }),
  );
  assert.ok(!empty.includes("Lista de regalos"));
  const item = {
    id: "gift",
    type: "text",
    binding: "gift_link",
    link: "/regalos",
    text: "Nuestra lista",
    x: 20,
    y: 20,
    width: 400,
    height: 100,
    font: "serif",
    fontSize: 30,
    color: "#766044",
    align: "center",
  };
  event.sections = [
    {
      id: "one",
      canvas: {
        width: 720,
        height: 960,
        background: "#ffffff",
        elements: [item],
      },
    },
  ];
  const html = renderToStaticMarkup(
    createElement(Invitation, {
      event,
      giftURL: "/regalos/personal-token",
      showOpening: false,
      showBrand: false,
    }),
  );
  assert.match(html, /href="\/regalos\/personal-token"/);
  assert.equal(html.match(/Nuestra lista/g).length, 1);
});
