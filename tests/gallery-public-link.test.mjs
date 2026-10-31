import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { readyInvitationURL } = loadSource(
  "src/features/studio/invitation-public-link.tsx",
);
const event = {
  id: "one",
  kind: "wedding",
  slug: "ana-y-lucas",
  paymentStatus: "paid",
  publishedAt: "2026-10-31",
};
const deployment = {
  eventId: "one",
  phase: "ready",
  host: "ana-y-lucas.save.thedate.now",
};
test("gallery exposes only the verified invitation for the matching product", () => {
  assert.equal(
    readyInvitationURL(event, deployment),
    "https://ana-y-lucas.save.thedate.now",
  );
  assert.equal(
    readyInvitationURL(
      { ...event, kind: "general" },
      { ...deployment, host: "ana-y-lucas.thedate.now" },
    ),
    "https://ana-y-lucas.thedate.now",
  );
  for (const phase of [
    "pending",
    "configured",
    "deploying",
    "verifying",
    "error",
  ])
    assert.equal(readyInvitationURL(event, { ...deployment, phase }), "");
});
test("gallery withholds links for drafts, demos, unpaid events and unexpected hosts", () => {
  for (const patch of [
    { isDemo: true },
    { publishedAt: null },
    { paymentStatus: "unpaid" },
    { slug: "../bad" },
  ])
    assert.equal(readyInvitationURL({ ...event, ...patch }, deployment), "");
  assert.equal(readyInvitationURL(event, null), "");
  assert.equal(
    readyInvitationURL(event, { ...deployment, eventId: "other" }),
    "",
  );
  assert.equal(
    readyInvitationURL(event, { ...deployment, host: "evil.example" }),
    "",
  );
});
