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
test("invitation links preserve the design and response links isolate the form", async () => {
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
    assert.match(html, /Full invitation/);
    assert.doesNotMatch(html, /Companions|confirmacion|personal-confirm-link/);
    const answer = renderToStaticMarkup(
      await Page({ token: "a".repeat(48), answer: true }),
    );
    assert.doesNotMatch(answer, /Full invitation/);
    if (response === "pending") {
      assert.doesNotMatch(answer, /Companions/);
      assert.match(answer, /Primero, responde en WhatsApp/);
    } else assert.match(answer, /Companions/);
    assert.match(answer, /#f4f0ff/i);
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

test("a saved maybe stays pending and offers a final confirmation with its companions", () => {
  const Form = loadSource("src/features/rsvp/rsvp-form.tsx", {
    mocks: {
      "./use-rsvp": {
        useRSVP: () => ({
          details: {
            guestName: "Ana",
            eventTitle: "Boda",
            seats: 2,
            response: "maybe",
          },
          saved: true,
          response: "maybe",
          companions: [{ name: "Luis", lastName: "Perez" }],
          resume() {},
        }),
      },
    },
  }).default;
  const html = renderToStaticMarkup(
    createElement(Form, { token: "b".repeat(48) }),
  );
  assert.match(html, /RESPUESTA PENDIENTE/);
  assert.match(html, /Confirmar S\u00ed o No/);
  assert.match(html, /Luis/);
  assert.doesNotMatch(html, /Para solicitar un cambio/);
});
test("reopening maybe allows choosing a final response and keeps the registered companion", () => {
  const Form = loadSource("src/features/rsvp/rsvp-form.tsx", {
    mocks: {
      "./use-rsvp": {
        useRSVP: () => ({
          details: {
            guestName: "Ana",
            eventTitle: "Boda",
            seats: 2,
            response: "maybe",
          },
          saved: false,
          response: "maybe",
          companions: [{ name: "Luis", lastName: "Perez", gender: "man" }],
          reason: "Waiting for permission",
          setResponse() {},
          setReason() {},
          setCompanions() {},
          submit() {},
        }),
      },
    },
  }).default;
  const html = renderToStaticMarkup(
    createElement(Form, { token: "b".repeat(48) }),
  );
  assert.match(html, /name="response"/);
  assert.match(html, /value="going"/);
  assert.match(html, /value="not_going"/);
  assert.match(html, /value="Luis"/);
  assert.doesNotMatch(html, /se registra una sola vez/);
});
