import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { calendarDownload } = loadSource("src/lib/events/calendar.ts");
test("calendar uses the event time and escapes authored content", () => {
  const href = calendarDownload({
    id: "event",
    title: "Ana, Luis; Fiesta\nInvitados",
    startAt: "2026-10-31T19:00:00-05:00",
    location: "Lima, Peru",
  });
  const data = decodeURIComponent(href.split(",").slice(1).join(","));
  assert.match(data, /DTSTART:20261101T000000Z/);
  assert.match(data, /DTEND:20261101T040000Z/);
  assert.match(data, /SUMMARY:Ana\\, Luis\\; Fiesta\\nInvitados/);
  assert.equal(calendarDownload({ startAt: "bad" }), "");
});
test("every new flyer template includes an optional editable calendar element", () => {
  const { invitationTemplates } = loadSource(
    "src/lib/events/template-catalog.ts",
  );
  const { templateSequence } = loadSource(
    "src/features/designer/template-sequence.ts",
    { globals: { crypto } },
  );
  for (const template of invitationTemplates.filter(
    (t) => t.mode === "flyer",
  )) {
    const pages = templateSequence(template);
    const items = pages.flatMap((p) => p.canvas.elements);
    assert.equal(
      items.filter((e) => e.binding === "calendar_link").length,
      1,
      template.id,
    );
    assert.equal(items.find((e) => e.binding === "calendar_link").type, "text");
  }
});
test("answered personal links open the form directly without replaying the invitation", async () => {
  for (const response of ["going", "maybe", "not_going", "pending"]) {
    const event = {
      id: "event",
      kind: "wedding",
      slug: "wedding",
      accentColor: "#463466",
      sections: [{ canvas: { background: "#f4f0ff", elements: [] } }],
    };
    const Page = loadSource(
      "src/features/invitations/personal-invitation.tsx",
      {
        mocks: {
          "next/headers": {
            headers: async () =>
              new Headers({ host: "wedding.save.thedate.now" }),
          },
          "@/lib/api/server": {
            validInviteToken: () => true,
            backendFetch: async () => Response.json({ event, response }),
          },
          "@/lib/events/invitation-runtime": { invitationTarget: () => null },
          "./live-invitation": { default: () => null },
          "./invitation": {
            default: () => createElement("div", null, "Full invitation"),
          },
          "./invitation-brand": { default: () => null },
          "@/features/rsvp/rsvp-form": {
            default: () => createElement("form", null, "Companions"),
          },
        },
      },
    ).default;
    const html = renderToStaticMarkup(await Page({ token: "a".repeat(48) }));
    assert.equal(html.includes("Full invitation"), response === "pending");
    assert.match(html, /Companions/);
    assert.match(html, /#f4f0ff/i);
  }
});
test("a completed RSVP shows its receipt with no editable form", () => {
  const Form = loadSource("src/features/rsvp/rsvp-form.tsx", {
    mocks: {
      "./use-rsvp": {
        useRSVP: () => ({
          details: { guestName: "Ana", eventTitle: "Boda", seats: 2 },
          saved: true,
          response: "going",
          companions: [{ name: "Luis", lastName: "Perez" }],
        }),
      },
    },
  }).default;
  const html = renderToStaticMarkup(
    createElement(Form, { token: "a".repeat(48) }),
  );
  assert.match(html, /Luis/);
  assert.doesNotMatch(html, /<form|<input|<textarea|cambiar tu respuesta/);
});
