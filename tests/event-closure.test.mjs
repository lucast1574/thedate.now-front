import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";

const { eventReadOnly } = loadSource("src/lib/events/event-closure.ts");
test("both products stay editable until their local calendar day ends", () => {
  for (const kind of ["general", "wedding"]) {
    for (const [timeZone, startAt, midnight] of [
      ["America/Bogota", "2026-11-01T01:00:00Z", "2026-11-01T05:00:00Z"],
      ["America/New_York", "2026-11-01T05:30:00Z", "2026-11-02T05:00:00Z"],
      ["America/New_York", "2026-03-08T06:30:00Z", "2026-03-09T04:00:00Z"],
      ["Pacific/Kiritimati", "2026-11-01T01:00:00Z", "2026-11-01T10:00:00Z"],
    ]) {
      const event = { kind, timeZone, startAt };
      assert.equal(eventReadOnly(event, Date.parse(midnight) - 1), false);
      assert.equal(eventReadOnly(event, Date.parse(midnight)), true);
      assert.equal(
        eventReadOnly({ ...event, isDemo: true }, Date.parse(midnight)),
        false,
      );
    }
  }
});

test("closed event details retain access to the invitation and guests without editing or payment", () => {
  const Workspace = loadSource("src/features/studio/event-workspace.tsx", {
    mocks: {
      "next/link": { default: "a" },
      "./use-event-read-only": { useEventReadOnly: () => true },
      "./event-form": { default: "event-form" },
      "./pending-payment": { default: "payment" },
    },
  }).default;
  const event = {
    id: "past",
    ownerId: "owner",
    title: "Cumpleaños",
    paymentStatus: "paid",
    kind: "general",
  };
  const tree = Workspace({
    user: { id: "owner" },
    events: { selected: event, draft: event },
    feedback: {},
    actions: {},
  });
  const nodes = [];
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    nodes.push(node);
    walk(node.props?.children);
  }
  walk(tree);
  assert.ok(nodes.some((node) => node.props?.href === "/editor/past"));
  assert.ok(nodes.some((node) => node.props?.href === "/manager/past"));
  assert.equal(
    nodes.some((node) => ["event-form", "payment"].includes(node.type)),
    false,
  );
  const text = nodes
    .flatMap((node) => node.props?.children)
    .filter((value) => typeof value === "string")
    .join(" ");
  assert.doesNotMatch(text, /cerrad|terminó|caduc|vencid/i);
});
