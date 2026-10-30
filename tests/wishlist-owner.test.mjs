import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { filterOwnerGifts, ownerGiftStatus } = loadSource(
  "src/lib/events/wishlist-owner.ts",
);
const items = [
  {
    id: "a",
    title: "Cafetera",
    url: "https://shop.test/coffee",
    delivered: false,
  },
  {
    id: "b",
    title: "Parlante",
    url: "https://shop.test/music",
    guestId: "lucia",
    delivered: false,
  },
  {
    id: "c",
    title: "Audífonos",
    url: "https://shop.test/audio",
    guestId: "mateo",
    delivered: true,
  },
];
const names = { lucia: "Lucía Mendoza", mateo: "Mateo Salazar" };
test("owner filters distinguish available, reserved and received without double-counting", () => {
  assert.deepEqual(Array.from(items.map(ownerGiftStatus)), [
    "available",
    "reserved",
    "received",
  ]);
  for (const [filter, id] of [
    ["available", "a"],
    ["reserved", "b"],
    ["received", "c"],
  ])
    assert.equal(filterOwnerGifts(items, names, filter, "")[0].id, id);
  assert.equal(filterOwnerGifts(items, names, "all", "")[0].id, "b");
  assert.equal(items[0].id, "a");
});
test("owner search finds an accented gift or the guest responsible for it", () => {
  assert.equal(filterOwnerGifts(items, names, "all", "lucia")[0].id, "b");
  assert.equal(filterOwnerGifts(items, names, "all", "audifonos")[0].id, "c");
  assert.equal(filterOwnerGifts(items, names, "available", "Mateo").length, 0);
});
test("received gifts expose delivery controls while unreserved gifts expose editing", () => {
  const Card = loadSource("src/features/gifts/owner-gift-card.tsx").default;
  const render = (gift) =>
    renderToStaticMarkup(
      React.createElement(Card, {
        gift,
        eventId: "event",
        name: names[gift.guestId],
        busy: false,
        onEdit() {},
        onRemove() {},
        onReservation() {},
      }),
    );
  const available = render(items[0]),
    reserved = render(items[1]),
    received = render(items[2]);
  assert.match(available, />Editar</);
  assert.match(available, /Eliminar Cafetera/);
  assert.doesNotMatch(reserved, />Editar</);
  assert.match(reserved, /Marcar recibido/);
  assert.match(reserved, /Lucía Mendoza/);
  assert.match(received, /Marcar pendiente/);
  assert.match(received, /Recibido/);
});
test("visibility control accurately separates a private list from an unpublished activated list", () => {
  const Header = loadSource(
    "src/features/gifts/wishlist-owner-header.tsx",
  ).default;
  const render = (enabled, publishedAt) =>
    renderToStaticMarkup(
      React.createElement(Header, {
        event: {
          kind: "wedding",
          slug: "ana",
          paymentStatus: "paid",
          publishedAt,
        },
        list: { enabled, items: [], version: 1 },
        busy: false,
        view: "manage",
        onView() {},
        onToggle() {},
      }),
    );
  assert.match(render(false, "today"), /Solo tú puedes verla/);
  assert.match(render(true, undefined), /Lista activada/);
  assert.doesNotMatch(render(true, undefined), /Abrir lista publicada/);
  assert.match(render(true, "today"), /Visible para tus invitados/);
  assert.match(render(true, "today"), /Abrir lista publicada/);
});
