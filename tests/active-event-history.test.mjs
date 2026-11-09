import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

for (const kind of ["general", "wedding"]) {
  const user = { id: "owner", role: "user" };
  const future = {
    id: "future",
    title: "Celebración futura",
    kind,
    ownerId: "owner",
    paymentStatus: "paid",
    startAt: "2099-11-20T18:00:00Z",
    timeZone: "America/Bogota",
  };
  const past = {
    ...future,
    id: "past",
    title: "Celebración pasada",
    startAt: "2020-10-31T18:00:00Z",
  };
  test(`${kind}: expired remembered events cannot become the active invitation`, () => {
    let state = 0;
    const hook = loadSource("src/features/studio/use-active-invitation.ts", {
      mocks: {
        react: {
          useEffect() {},
          useState: () => [state++ === 0 ? [future, past] : "", () => {}],
        },
        "next/navigation": {
          useParams: () => ({}),
          useSearchParams: () => new URLSearchParams(),
        },
        "./use-event-recency": { useEventRecency: () => "past" },
      },
    }).useActiveInvitation;
    const result = hook(user, kind);
    assert.equal(result.selected.id, "future");
    assert.deepEqual(
      Array.from(result.events, (e) => e.id),
      ["future"],
    );
  });
  test(`${kind}: the gallery separates ended invitations from active work`, () => {
    for (const history of [false, true]) {
      const Gallery = loadSource("src/features/studio/event-gallery.tsx", {
        mocks: {
          react: { ...React, useState: () => [history, () => {}] },
          "next/link": {
            default: ({ children, ...props }) =>
              React.createElement("a", props, children),
          },
          "./use-event-recency": { useEventRecency: () => "past" },
          "./invitation-thumbnail": { default: () => null },
          "./demo-cover": { default: () => null },
        },
      }).default;
      const markup = renderToStaticMarkup(
        React.createElement(Gallery, {
          events: [future, past],
          user,
          portal: kind,
          loading: false,
          onCreate() {},
        }),
      );
      assert.ok(markup.includes(history ? past.title : future.title));
      assert.ok(!markup.includes(history ? future.title : past.title));
      assert.match(
        markup,
        history ? /Volver a activas/ : /Ver terminadas \(1\)/,
      );
    }
  });
}
