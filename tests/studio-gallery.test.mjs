import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { galleryEvents } = loadSource("src/lib/events/studio-gallery.ts");
test("studio prioritizes recent work, preserves shared invitations, and keeps demos personal", () => {
  const user = { id: "owner", role: "admin" };
  const events = [
    {
      id: "demo",
      kind: "wedding",
      ownerId: "owner",
      isDemo: true,
      updatedAt: "2026-10-06",
    },
    {
      id: "other-demo",
      kind: "wedding",
      ownerId: "other",
      isDemo: true,
      updatedAt: "2026-10-07",
    },
    { id: "old", kind: "wedding", ownerId: "owner", updatedAt: "2026-08-01" },
    {
      id: "recent",
      kind: "wedding",
      ownerId: "owner",
      updatedAt: "2026-10-01",
    },
    {
      id: "shared",
      kind: "wedding",
      ownerId: "other",
      coupleUserIds: ["owner"],
      updatedAt: "2026-09-01",
    },
    {
      id: "general",
      kind: "general",
      ownerId: "owner",
      updatedAt: "2026-10-05",
    },
  ];
  assert.deepEqual(
    galleryEvents(events, user, "wedding").map((e) => e.id),
    ["recent", "shared", "old", "demo"],
  );
  assert.equal(events[0].id, "demo");
  assert.deepEqual(
    galleryEvents(events, user, "general").map((e) => e.id),
    ["general"],
  );
});
