import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

const { default: EventDetails } = loadSource(
  "src/components/event-details.tsx",
);
const { default: InvitationSections } = loadSource(
  "src/features/invitations/invitation-sections.tsx",
);

test("event details keep timezone, organizer and physical/virtual meaning in both contexts", () => {
  const event = {
    startAt: "2027-01-01T18:00:00Z",
    timeZone: "America/Lima",
    kind: "general",
    organizer: "Lucas",
    location: "Lima",
    isVirtual: true,
  };
  for (const variant of ["invitation", "rsvp"]) {
    const html = renderToStaticMarkup(
      createElement(EventDetails, { event, variant }),
    );
    assert.match(html, /MODALIDAD/);
    assert.match(html, /En línea/);
    assert.match(html, /Lucas/);
    assert.doesNotMatch(html, /DÓNDE/);
  }
  const physical = renderToStaticMarkup(
    createElement(EventDetails, { event: { ...event, isVirtual: false } }),
  );
  assert.match(physical, /DÓNDE/);
  assert.match(physical, /Lima/);
});

test("reusable invitation sections preserve order and escape guest-facing text", () => {
  const sections = [
    {
      id: "first",
      icon: "heart",
      heading: "Primero",
      body: "<script>alert(1)</script>",
    },
    { id: "second", icon: "star", heading: "Segundo", body: "Historia" },
  ];
  const html = renderToStaticMarkup(
    createElement(InvitationSections, {
      sections,
      kind: "wedding",
      slug: "fixture",
    }),
  );
  assert.ok(html.indexOf("Primero") < html.indexOf("Segundo"));
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.equal(
    renderToStaticMarkup(
      createElement(InvitationSections, {
        sections: [],
        kind: "general",
        slug: "fixture",
      }),
    ),
    "",
  );
});
