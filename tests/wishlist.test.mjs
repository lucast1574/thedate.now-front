import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url),
  { loadSource } = require("./support/load-source.cjs");
const token = "a".repeat(48);
const data = {
  event: { id: "event-a", kind: "general", slug: "party" },
  guestName: "María",
  items: [],
  version: 0,
};
function scope({
  host = "party.thedate.now",
  pinned = null,
  payload = data,
} = {}) {
  let calls = 0;
  const loaded = loadSource("src/lib/api/gift-scope.ts", {
    mocks: {
      "next/headers": { headers: async () => new Headers({ host }) },
      "@/lib/events/invitation-runtime": { invitationTarget: () => pinned },
      "./server": {
        backendFetch: async () => {
          calls++;
          return Response.json(payload);
        },
        validInviteToken: (value) => /^[a-f0-9]{48}$/.test(value),
      },
    },
  });
  return { module: loaded, calls: () => calls };
}
test("gift access rejects tokens from another product, event or subdomain", async () => {
  assert.ok(await scope().module.scopedWishlist(token));
  assert.equal(
    await scope({ host: "other.thedate.now" }).module.scopedWishlist(token),
    null,
  );
  assert.equal(
    await scope({ host: "party.save.thedate.now" }).module.scopedWishlist(
      token,
    ),
    null,
  );
  assert.equal(
    await scope({
      pinned: { kind: "general", slug: "party", eventId: "event-b" },
    }).module.scopedWishlist(token),
    null,
  );
  const invalid = scope();
  assert.equal(await invalid.module.scopedWishlist("invalid"), null);
  assert.equal(invalid.calls(), 0);
  const res = scope().module.privateGiftJSON(data);
  assert.equal(res.headers.get("Cache-Control"), "private, no-store");
  assert.equal(res.headers.get("Referrer-Policy"), "no-referrer");
});
test("gift proxy refuses foreign origins and cross-event mutations before forwarding", async () => {
  let forwarded = 0;
  const common = {
    "@/lib/api/server": {
      invalidOrigin: () => true,
      backendFetch: async () => {
        forwarded++;
        return Response.json(data);
      },
      forwardJSON: (r) => r,
    },
    "@/lib/api/gift-scope": {
      scopedWishlist: async () => data,
      privateGiftJSON: (body, status = 200) => Response.json(body, { status }),
    },
  };
  let route = loadSource("src/app/api/gifts/[token]/route.ts", {
    mocks: common,
  });
  assert.equal(
    (
      await route.POST(
        new Request("https://party.thedate.now/api/gifts/" + token, {
          method: "POST",
          body: "{}",
        }),
        { params: Promise.resolve({ token }) },
      )
    ).status,
    403,
  );
  assert.equal(forwarded, 0);
  route = loadSource("src/app/api/gifts/[token]/route.ts", {
    mocks: {
      ...common,
      "@/lib/api/server": {
        ...common["@/lib/api/server"],
        invalidOrigin: () => false,
      },
      "@/lib/api/gift-scope": {
        ...common["@/lib/api/gift-scope"],
        scopedWishlist: async () => null,
      },
    },
  });
  assert.equal(
    (
      await route.POST(
        new Request("https://party.thedate.now/api/gifts/" + token, {
          method: "POST",
          body: "{}",
        }),
        { params: Promise.resolve({ token }) },
      )
    ).status,
    404,
  );
  assert.equal(forwarded, 0);
});
test("published invitation routes expose only scoped gifts and no management pages", () => {
  const { allowedInvitationPath } = loadSource(
    "src/lib/events/invitation-runtime.ts",
  );
  for (const path of [
    "/regalos",
    `/regalos/${token}`,
    `/api/gifts/${token}`,
    `/api/gifts/${token}/images/gift-a`,
  ])
    assert.ok(allowedInvitationPath(path), path);
  for (const path of [
    "/organizar",
    "/api/wishlist-images/event/gift",
    `/regalos/${token}/admin`,
    `/api/gifts/${token}/images/../../profile`,
  ])
    assert.ok(!allowedInvitationPath(path), path);
});
test("guest codes accept the personal WhatsApp link without following its destination", () => {
  const { giftToken } = loadSource("src/features/gifts/gift-code-entry.tsx", {
    mocks: { "next/navigation": { useRouter: () => ({}) } },
  });
  assert.equal(giftToken(token), token);
  assert.equal(giftToken(`https://party.thedate.now/rsvp/${token}`), token);
  assert.equal(giftToken(`https://party.thedate.now/regalos/${token}`), token);
  assert.equal(giftToken("javascript:alert(1)"), "");
});
