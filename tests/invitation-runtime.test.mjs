import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const runtime = (env = {}) =>
  loadSource("src/lib/events/invitation-runtime.ts", {
    globals: { process: { env } },
  });
test("invitation containers require all identity fields and reject reserved slugs", () => {
  assert.equal(runtime().invitationTarget(), null);
  for (const env of [
    { INVITATION_KIND: "wedding" },
    {
      INVITATION_KIND: "bad",
      INVITATION_SLUG: "ana",
      INVITATION_EVENT_ID: "id",
    },
    {
      INVITATION_KIND: "wedding",
      INVITATION_SLUG: "studio",
      INVITATION_EVENT_ID: "id",
    },
  ])
    assert.throws(() => runtime(env).invitationTarget());
  const target = runtime({
    INVITATION_KIND: "wedding",
    INVITATION_SLUG: "ana",
    INVITATION_EVENT_ID: "uuid-123",
  }).invitationTarget();
  assert.equal(target.kind, "wedding");
  assert.equal(target.slug, "ana");
});
test("dedicated invitation runtime exposes public routes and denies account routes", () => {
  const { allowedInvitationPath: allow } = runtime();
  for (const path of [
    "/",
    "/api/invitation-health",
    "/_next/static/styles.css",
    `/rsvp/${"a".repeat(48)}`,
    `/api/rsvp/${"b".repeat(48)}`,
    "/api/public-photos/wedding/ana/photo.jpg",
  ])
    assert.equal(allow(path), true, path);
  for (const path of [
    "/api/session",
    "/api/backend/events",
    "/api/auth/google/start",
    "/join/token",
    "/api/photos/id/key",
    "/rsvp/invalid",
  ])
    assert.equal(allow(path), false, path);
});
test("both product domains reject management names and ambiguous host prefixes", () => {
  const { invitationFromHost: resolve } = loadSource(
    "src/lib/events/domains.ts",
  );
  for (const host of [
    "studio.save.thedate.now",
    "crea.thedate.now",
    "studio.save.thedate.now.evil.test",
    "a--b.thedate.now",
    "api.save.thedate.now",
  ])
    assert.equal(resolve(host), null);
});
test("pinned RSVP route rejects tokens from another event before submitting", async () => {
  let writes = 0;
  const { POST, GET } = loadSource("src/app/api/rsvp/[token]/route.ts", {
    mocks: {
      "@/lib/events/invitation-runtime": {
        invitationTarget: () => ({ kind: "wedding", slug: "ana" }),
      },
      "@/lib/api/server": {
        validInviteToken: () => true,
        invalidOrigin: () => false,
        forwardJSON: (r) => r,
        backendFetch: async (_path, init) => {
          if (init?.method === "POST") writes++;
          return Response.json({ kind: "general", slug: "other" });
        },
      },
    },
  });
  const context = { params: Promise.resolve({ token: "a".repeat(48) }) };
  assert.equal(
    (await GET(new Request("https://ana.save.thedate.now"), context)).status,
    404,
  );
  assert.equal(
    (
      await POST(
        new Request("https://ana.save.thedate.now", {
          method: "POST",
          body: "{}",
        }),
        context,
      )
    ).status,
    404,
  );
  assert.equal(writes, 0);
});
test("designer refresh merges saved changes without discarding an unsaved section", () => {
  const { mergeDesign } = loadSource("src/features/designer/merge-design.ts");
  const baseline = {
    id: "event",
    title: "Before",
    description: "Text",
    template: "classic",
    accentColor: "#abcdef",
    photoKeys: [],
    sections: [{ id: "section", body: "old" }],
  };
  const current = {
    ...baseline,
    sections: [{ id: "section", body: "unsaved edit" }],
    photoKeys: ["new.jpg"],
  };
  const merged = mergeDesign(current, baseline, {
    ...baseline,
    title: "Saved from event form",
    photoKeys: ["new.jpg"],
  });
  assert.equal(merged.title, "Saved from event form");
  assert.equal(merged.sections[0].body, "unsaved edit");
  assert.equal(merged.photoKeys.length, 1);
});
