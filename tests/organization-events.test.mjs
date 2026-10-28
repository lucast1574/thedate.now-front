import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { organizationEvents, organizationEventDate } = loadSource(
  "src/lib/events/organization-events.ts",
);
const user = { id: "owner", role: "admin" };
test("one event needs no selector; multiple events render invitation cards without a dropdown", () => {
  const Picker = loadSource("src/features/manager/manager-event-picker.tsx", {
    mocks: {
      "next/navigation": { useRouter: () => ({ push() {} }) },
      "@/features/studio/invitation-thumbnail": { default: () => null },
    },
  }).default;
  const first = {
    id: "one",
    title: "Ana y Juan",
    kind: "wedding",
    ownerId: user.id,
    paymentStatus: "paid",
    startAt: "2026-10-31T23:00:00Z",
  };
  const render = (events) =>
    renderToStaticMarkup(
      React.createElement(Picker, {
        events,
        event: first,
        user,
        tab: "guests",
        guard: () => true,
      }),
    );
  const single = render([first]);
  assert.match(single, /Ana y Juan/);
  assert.doesNotMatch(single, /<button|combobox|<select/);
  const multiple = render([
    first,
    { ...first, id: "two", title: "Maria y Luis" },
    { ...first, id: "pending", title: "Unpaid", paymentStatus: "pending" },
  ]);
  assert.equal((multiple.match(/<button/g) || []).length, 2);
  assert.match(multiple, /aria-pressed="true"/);
  assert.match(multiple, /Maria y Luis/);
  assert.doesNotMatch(multiple, /combobox|<select|Unpaid|Activo/);
});
test("organization excludes unpaid, demo and unrelated events even for admins", () => {
  const base = { kind: "wedding", ownerId: "owner", paymentStatus: "paid" };
  const events = [
    { ...base, id: "new", createdAt: "2026-10-28" },
    { ...base, id: "demo", isDemo: true },
    { ...base, id: "other", kind: "general" },
    { ...base, id: "unpaid", paymentStatus: "unpaid" },
    { ...base, id: "pending", paymentStatus: "pending" },
    { ...base, id: "foreign", ownerId: "other" },
    {
      ...base,
      id: "shared",
      ownerId: "other",
      coupleUserIds: ["owner"],
      createdAt: "2026-02-01",
    },
    { ...base, id: "first", createdAt: "2025-01-01", startAt: "2025-02-01" },
  ];
  assert.deepEqual(
    Array.from(organizationEvents(events, "wedding", user), (e) => e.id),
    ["first", "shared", "new"],
  );
  assert.equal(events[0].id, "new");
});
test("event cards use a short local date without payment status or URL", () => {
  const date = organizationEventDate({
    startAt: "2026-11-01T01:00:00Z",
    timeZone: "America/Bogota",
  });
  assert.match(date, /31/);
  assert.match(date, /oct/);
  assert.match(date, /2026/);
  assert.doesNotMatch(date, /Activo|paid|https|:/);
  assert.equal(organizationEventDate({ startAt: "" }), "Fecha por confirmar");
});
