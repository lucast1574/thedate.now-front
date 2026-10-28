import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { organizationEvents, organizationEventLabel } = loadSource(
  "src/lib/events/organization-events.ts",
);
test("organization excludes demos, preserves past and unpaid events, and defaults to first created", () => {
  const events = [
    {
      id: "new",
      kind: "wedding",
      createdAt: "2026-10-28",
      paymentStatus: "paid",
    },
    { id: "demo", kind: "wedding", isDemo: true },
    { id: "other", kind: "general" },
    {
      id: "first",
      kind: "wedding",
      createdAt: "2025-01-01",
      startAt: "2025-02-01",
      paymentStatus: "pending",
    },
  ];
  assert.deepEqual(
    Array.from(organizationEvents(events, "wedding"), (e) => e.id),
    ["first", "new"],
  );
  assert.equal(events[0].id, "new");
});
test("same-title events are distinguished by date, status and invitation address", () => {
  const event = {
    title: "Nuestra boda",
    startAt: "2026-11-01T15:00:00Z",
    timeZone: "America/Bogota",
    paymentStatus: "paid",
    slug: "ana-y-juan",
  };
  const label = organizationEventLabel(event);
  assert.match(label, /Nuestra boda/);
  assert.match(label, /2026/);
  assert.match(label, /Activo/);
  assert.match(label, /ana-y-juan/);
});
