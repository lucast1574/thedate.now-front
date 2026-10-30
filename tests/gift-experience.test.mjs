import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { exampleWishlist } = loadSource("src/features/gifts/gift-examples.ts");
const { default: View } = loadSource(
  "src/features/gifts/guest-wishlist-view.tsx",
);
const { giftStore } = loadSource("src/lib/events/gift-store.ts");

function hooks(runEffects = false) {
  const effects = [];
  const slots = [];
  let cursor = 0;
  return {
    flushEffects: () => effects.splice(0).forEach((effect) => effect()),
    reset: () => {
      cursor = 0;
    },
    react: {
      useState(initial) {
        const i = cursor++;
        if (!(i in slots))
          slots[i] = typeof initial === "function" ? initial() : initial;
        return [
          slots[i],
          (next) => {
            slots[i] = typeof next === "function" ? next(slots[i]) : next;
          },
        ];
      },
      useRef(initial) {
        const i = cursor++;
        return (slots[i] ||= { current: initial });
      },
      useEffect(effect) {
        if (runEffects) effects.push(effect);
      },
      useCallback: (fn) => fn,
    },
  };
}
test("the real guest catalogue shows the three stores, availability and a separate purchase action", () => {
  const data = exampleWishlist(true);
  let html = renderToStaticMarkup(
    createElement(View, {
      data,
      imageSource: () => undefined,
      onChoose: async () => true,
    }),
  );
  for (const name of [
    "Saga Falabella",
    "Mercado Libre",
    "Coolbox",
    "Quiero regalarlo",
    "Otro invitado lo eligió",
  ])
    assert.ok(html.includes(name), name);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /referrerPolicy="no-referrer"/i);
  data.items[0].mine = data.items[0].reserved = true;
  html = renderToStaticMarkup(
    createElement(View, {
      data,
      imageSource: () => undefined,
      onChoose: async () => true,
    }),
  );
  assert.ok(html.includes("Tu elección está reservada"));
  assert.ok(html.includes("Ir a Saga Falabella"));
  assert.ok(html.includes("Cambiar mi elección"));
  assert.ok(html.includes("Ya tienes un regalo elegido"));
});
test("store labels match hostname boundaries", () => {
  assert.equal(giftStore("https://www.coolbox.pe/product/p"), "Coolbox");
  assert.equal(
    giftStore("https://coolbox.pe.evil.test/p"),
    "coolbox.pe.evil.test",
  );
  assert.equal(giftStore("bad-url"), "Ver tienda");
});
test("changing a product link ignores an old pending metadata response", async () => {
  const h = hooks();
  let resolve;
  const { useGiftDraft: draftHook } = loadSource(
    "src/features/gifts/use-gift-draft.ts",
    {
      mocks: {
        react: h.react,
        "@/lib/api/client": {
          api: () =>
            new Promise((done) => {
              resolve = done;
            }),
        },
      },
      globals: { crypto: globalThis.crypto },
    },
  );
  const render = () => {
    h.reset();
    return draftHook("event");
  };
  render().changeURL("https://www.coolbox.pe/first/p");
  const pending = render().lookup();
  render().changeURL("https://www.coolbox.pe/second/p");
  resolve({ title: "Old product", imageUrl: "https://images.example/old.jpg" });
  await pending;
  assert.equal(render().draft.title, "");
  assert.equal(render().draft.url, "https://www.coolbox.pe/second/p");
  assert.equal(render().fetching, false);
});
test("metadata import preserves an edit made while the lookup is pending", async () => {
  const h = hooks();
  let resolve;
  const { useGiftDraft: draftHook } = loadSource(
    "src/features/gifts/use-gift-draft.ts",
    {
      mocks: {
        react: h.react,
        "@/lib/api/client": {
          api: () =>
            new Promise((done) => {
              resolve = done;
            }),
        },
      },
      globals: { crypto: globalThis.crypto },
    },
  );
  const render = () => {
    h.reset();
    return draftHook("event");
  };
  render().changeURL("https://www.coolbox.pe/product/p");
  const pending = render().lookup();
  render().setDraft((draft) => ({ ...draft, title: "My chosen model" }));
  resolve({
    title: "Imported title",
    imageUrl: "https://images.example/new.jpg",
  });
  await pending;
  assert.equal(render().draft.title, "My chosen model");
  assert.equal(render().draft.imageUrl, "https://images.example/new.jpg");
});
test("guest reservations guard double submit and report success only after the server confirms", async () => {
  const h = hooks();
  let resolve,
    calls = 0;
  const { useGuestWishlist: guestHook } = loadSource(
    "src/features/gifts/use-guest-wishlist.ts",
    {
      mocks: {
        react: h.react,
        "@/lib/api/client": {
          api: () => {
            calls++;
            return new Promise((done) => {
              resolve = done;
            });
          },
        },
      },
    },
  );
  const initial = exampleWishlist(false);
  const render = () => {
    h.reset();
    return guestHook("token", initial);
  };
  const pending = render().choose(initial.items[0].id);
  assert.equal(await render().choose(initial.items[1].id), false);
  assert.equal(calls, 1);
  assert.equal(render().busy, true);
  resolve({
    ...initial,
    version: 1,
    items: initial.items.map((item, i) => ({
      ...item,
      mine: i === 0,
      reserved: i === 0 || item.reserved,
    })),
  });
  assert.equal(await pending, true);
  assert.equal(render().data.items[0].mine, true);
  assert.equal(render().busy, false);
});

test("a reservation conflict refreshes availability and never reports a successful choice", async () => {
  const h = hooks();
  const initial = exampleWishlist(false);
  const latest = {
    ...initial,
    version: 2,
    items: initial.items.map((item) => ({ ...item, reserved: true })),
  };
  const { useGuestWishlist: guestHook } = loadSource(
    "src/features/gifts/use-guest-wishlist.ts",
    {
      mocks: {
        react: h.react,
        "@/lib/api/client": {
          api: async (_path, method) => {
            if (method === "POST")
              throw new Error("Otra invitación acaba de elegir este regalo.");
            return latest;
          },
        },
      },
    },
  );
  const render = () => {
    h.reset();
    return guestHook("token", initial);
  };
  assert.equal(await render().choose(initial.items[0].id), false);
  assert.equal(render().data.version, 2);
  assert.ok(render().data.items.every((item) => item.reserved && !item.mine));
  assert.match(render().error, /Otra invitación/);
  assert.equal(render().notice, "");
  assert.equal(render().busy, false);
});

test("editing a saved gift with a different product link clears the previous product's imported fields", () => {
  const h = hooks();
  const { useGiftDraft: draftHook } = loadSource(
    "src/features/gifts/use-gift-draft.ts",
    {
      mocks: { react: h.react },
    },
  );
  const gift = {
    id: "coffee",
    title: "Previous product",
    imageUrl: "https://shop.example/previous.jpg",
    url: "https://shop.example/previous",
    delivered: false,
  };
  const render = () => {
    h.reset();
    return draftHook("event", gift);
  };
  render().changeURL("https://shop.example/new");
  assert.equal(render().draft.title, "");
  assert.equal(render().draft.imageUrl, "");
});

test("pasted links fetch automatically and preserve custom product fields", async () => {
  const h = hooks(true);
  const timers = [];
  let calls = 0;
  const { useGiftDraft: draftHook } = loadSource(
    "src/features/gifts/use-gift-draft.ts",
    {
      mocks: {
        react: h.react,
        "@/lib/api/client": {
          api: async () => {
            calls++;
            return {
              title: "Store title",
              imageUrl: "https://cdn.example/product.jpg",
              url: "https://shop.example/products/cup",
            };
          },
        },
      },
      globals: {
        crypto: globalThis.crypto,
        setTimeout: (fn) => {
          timers.push(fn);
          return timers.length;
        },
        clearTimeout: () => {},
      },
    },
  );
  const render = () => {
    h.reset();
    return draftHook("event");
  };
  render().changeURL("https://shop.example/products/cup?utm_source=share");
  let hook = render();
  hook.setDraft({
    ...hook.draft,
    title: "Our favourite cups",
    imageUrl: "https://cdn.example/our-choice.jpg",
  });
  render();
  h.flushEffects();
  timers.at(-1)();
  await new Promise(setImmediate);
  hook = render();
  assert.equal(calls, 1);
  assert.equal(hook.draft.title, "Our favourite cups");
  assert.equal(hook.draft.imageUrl, "https://cdn.example/our-choice.jpg");
  assert.equal(hook.draft.url, "https://shop.example/products/cup");
  const scheduled = timers.length;
  h.flushEffects();
  assert.equal(timers.length, scheduled);
  assert.equal(calls, 1);
});

test("retail store labels cover LATAM without matching unrelated hosts", () => {
  for (const [url, label] of [
    ["https://simple.ripley.com.pe/p", "Ripley"],
    ["https://www.falabella.com.co/p", "Falabella"],
    ["https://www.mercadolibre.com.mx/p", "Mercado Libre"],
    ["https://www.mercadolivre.com.br/p", "Mercado Livre"],
    ["https://www.oechsle.pe/p", "Oechsle"],
    ["https://ripley.cl.evil.example/p", "ripley.cl.evil.example"],
  ])
    assert.equal(giftStore(url), label);
});
