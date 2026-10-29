import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { organizationEvents, organizationEventDate } = loadSource(
  "src/lib/events/organization-events.ts",
);
const user = { id: "owner", role: "admin" };
const first = {
  id: "one",
  title: "Ana y Juan",
  kind: "wedding",
  ownerId: user.id,
  paymentStatus: "paid",
  startAt: "2026-10-31T23:00:00Z",
};
const second = { ...first, id: "two", title: "Maria y Luis" };
const linkMock = {
  default: ({ children, ...props }) =>
    React.createElement("a", props, children),
};
test("selection cards open each event in the requested section", () => {
  const Picker = loadSource("src/features/manager/manager-event-picker.tsx", {
    mocks: {
      "next/link": linkMock,
      "@/features/studio/invitation-thumbnail": { default: () => null },
    },
  }).default;
  for (const tab of ["guests", "tables", "gifts"]) {
    const markup = renderToStaticMarkup(
      React.createElement(Picker, {
        events: [first, second],
        wedding: true,
        tab,
      }),
    );
    assert.match(markup, new RegExp(`/manager/one\\?tab=${tab}`));
    assert.match(markup, new RegExp(`/manager/two\\?tab=${tab}`));
    assert.match(markup, /Maria y Luis/);
    assert.doesNotMatch(markup, /aria-pressed|combobox|<select/);
  }
});
test("organization waits for a choice with multiple events and opens a single event directly", () => {
  for (const tool of ["guests", "tables", "gifts"]) {
    for (const events of [[], [first], [first, second]]) {
      let stateIndex = 0;
      const redirects = [];
      const Page = loadSource("src/features/manager/organization-page.tsx", {
        mocks: {
          react: {
            ...React,
            useState: () => [[events, "", true][stateIndex++], () => {}],
            useEffect: (effect, deps) => {
              if (deps.length === 4) effect();
            },
          },
          "next/link": linkMock,
          "next/navigation": {
            useSearchParams: () => new URLSearchParams({ tool }),
            useRouter: () => ({ replace: (href) => redirects.push(href) }),
          },
          "@/features/account/account-shell": {
            default: ({ children }) => children(user),
          },
          "@/features/studio/invitation-thumbnail": { default: () => null },
          "./organization-preview": {
            default: () => React.createElement("div", null, "Preview"),
          },
        },
      }).default;
      const markup = renderToStaticMarkup(
        React.createElement(Page, { wedding: true, googleEnabled: false }),
      );
      assert.deepEqual(
        redirects,
        events.length === 1 ? [`/manager/one?tab=${tool}`] : [],
      );
      assert.equal(
        markup.includes("organization-event-card"),
        events.length > 1,
      );
      assert.equal(markup.includes("Preview"), events.length === 0);
    }
  }
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

test("manager replaces cards with a guarded back link in every section", () => {
  for (const tab of ["guests", "tables", "gifts"]) {
    for (const count of [1, 2]) {
      let backLink;
      const Page = loadSource("src/features/manager/manager-page.tsx", {
        mocks: {
          "next/link": {
            default: (props) => {
              if (props.className === "manager-event-back") backLink = props;
              return React.createElement("a", props, props.children);
            },
          },
          "next/navigation": {
            useSearchParams: () => new URLSearchParams({ tab }),
          },
          "./use-manager": {
            useManager: () => ({
              event: first,
              events: [first, second].slice(0, count),
              user,
              guests: [],
              dirty: true,
            }),
          },
          "@/features/studio/workspace-sidebar": { default: () => null },
          "./manager-tools": {
            default: () => React.createElement("div", null, "Tools"),
          },
          "./guest-summary": { default: () => null },
          "@/features/gifts/wishlist-panel": { default: () => null },
        },
        globals: { window: { confirm: () => false } },
      }).default;
      const markup = renderToStaticMarkup(
        React.createElement(Page, { id: first.id }),
      );
      assert.match(markup, /Tools/);
      assert.doesNotMatch(markup, /organization-event-card/);
      assert.equal(Boolean(backLink), count > 1);
      if (backLink) {
        assert.equal(backLink.href, `/organizar?tool=${tab}`);
        let prevented = false;
        backLink.onClick({
          preventDefault() {
            prevented = true;
          },
        });
        assert.equal(prevented, true);
      }
    }
  }
});
