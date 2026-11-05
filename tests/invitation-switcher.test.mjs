import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const Switcher = loadSource(
  "src/features/studio/invitation-switcher.tsx",
).default;
test("the switcher appears only with multiple real invitations; demos do not count", () => {
  for (const kind of ["wedding", "general"]) {
    const real = {
      id: "one",
      title: "Mi celebración",
      kind,
      paymentStatus: "paid",
    };
    const demo = {
      ...real,
      id: "demo",
      title: "Demo que debe quedar fuera",
      isDemo: true,
    };
    const render = (events) =>
      renderToStaticMarkup(
        React.createElement(Switcher, {
          events,
          selected: real,
          onSelect: () => {},
        }),
      );
    assert.equal(render([]), "");
    assert.equal(render([real, demo]), "");
    assert.doesNotMatch(
      render([real, { ...real, id: "two" }, demo]),
      /Demo que debe quedar fuera/,
    );
    assert.match(
      render([real, { ...real, id: "two" }, demo]),
      /Cambiar invitación/,
    );
  }
});
