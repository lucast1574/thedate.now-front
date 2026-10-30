import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { personalPath, personalToken, tokenFromPath } = loadSource(
  "src/lib/events/personal-links.ts",
);
const { allowedInvitationPath } = loadSource(
  "src/lib/events/invitation-runtime.ts",
);
test("personal addresses retain all 192 token bits and accept old invitation paths", () => {
  for (const token of [
    "00".repeat(24),
    "aa".repeat(24),
    "0123456789abcdef".repeat(3),
  ]) {
    const path = personalPath(token, "Lúcás Santillán");
    assert.match(path, /^\/para\/lucas-santillan-/);
    assert.equal(personalToken(path.slice(6)), token);
    for (const ending of ["", "/respuesta", "/regalos"]) {
      assert.equal(tokenFromPath(path + ending), token);
      assert.equal(allowedInvitationPath(path + ending), true);
    }
    assert.equal(tokenFromPath(`/rsvp/${token}/respuesta`), token);
    assert.equal(tokenFromPath(`/regalos/${token}`), token);
  }
  assert.equal(
    personalPath("00".repeat(24), "Lúcás Santillán"),
    "/para/lucas-santillan-" + "A".repeat(32),
  );
  assert.equal(personalToken("lucas-123"), "");
  assert.equal(
    allowedInvitationPath("/para/ana-" + "A".repeat(32) + "/admin"),
    false,
  );
});
test("empty wishlists explain the next visit in the language of each product", () => {
  const View = loadSource("src/features/gifts/guest-wishlist-view.tsx").default;
  for (const kind of ["wedding", "general"]) {
    const html = renderToStaticMarkup(
      createElement(View, {
        data: {
          event: { kind, title: "Celebración" },
          guestName: "",
          items: [],
          version: 0,
        },
        imageSource: () => undefined,
        onChoose: async () => false,
      }),
    );
    assert.match(
      html,
      kind === "wedding"
        ? /Los novios aún no han añadido/
        : /Quien organiza aún está preparando/,
    );
    assert.doesNotMatch(html, /Pega aquí|Tu código|>, tu compañía/);
  }
});
test("public catalogue checks the pinned event and remembered invitations are scoped", async () => {
  const initial = {
    event: { id: "event", kind: "wedding", slug: "ana" },
    items: [],
    guestName: "",
    version: 0,
  };
  let personal = null;
  const catalog = loadSource("src/lib/api/gift-catalog.ts", {
    mocks: {
      "next/headers": {
        headers: async () => new Headers({ host: "ana.save.thedate.now" }),
        cookies: async () => ({ get: () => ({ value: "a".repeat(48) }) }),
      },
      "@/lib/events/invitation-runtime": {
        invitationTarget: () => ({
          kind: "wedding",
          slug: "ana",
          eventId: "event",
        }),
      },
      "./server": { backendFetch: async () => Response.json(initial) },
      "./gift-scope": { scopedWishlist: async () => personal },
    },
  });
  assert.ok(await catalog.publicGiftCatalog());
  assert.equal(await catalog.rememberedWishlist(), null);
  personal = { ...initial, guestName: "Ana" };
  assert.equal((await catalog.rememberedWishlist()).data.guestName, "Ana");
  initial.event.id = "foreign";
  assert.equal(await catalog.publicGiftCatalog(), null);
});

test("saving a from-scratch gift element supplies its own destination without asking for a link", () => {
  const { designPayload } = loadSource("src/features/designer/design-state.ts");
  const item = {
    id: "gift",
    type: "text",
    binding: "gift_link",
    text: "Nuestra lista",
    color: "#463466",
  };
  const payload = designPayload({
    kind: "wedding",
    template: "classic",
    sections: [{ id: "gifts", canvas: { elements: [item] } }],
  });
  const saved = payload.sections[0].canvas.elements[0];
  assert.equal(saved.link, "/regalos");
  assert.equal(saved.text, item.text);
  assert.equal(saved.color, item.color);
  assert.equal(item.link, undefined);
});
