import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

function renderDelivery(phase, total = 4) {
  const Delivery = loadSource("src/features/manager/invitation-delivery.tsx", {
    mocks: {
      "./use-invitation-delivery": {
        useInvitationDelivery: () => ({
          delivery: {
            phase,
            total,
            sent: 0,
            waiting: total,
            failed: 0,
            uncertain: 0,
          },
          busy: false,
          error: "",
          start() {},
        }),
      },
    },
  }).default;
  return renderToStaticMarkup(
    React.createElement(Delivery, { eventId: "e", onUpdate: async () => {} }),
  );
}
test("preparing website announces progress and cannot start another send", () => {
  const html = renderDelivery("preparing");
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /Todavía no estamos enviando mensajes/);
  assert.doesNotMatch(html, /<button/);
  assert.match(html, /Comprobamos el enlace/);
});
test("waiting explains automatic advancement without offering duplicate sends", () => {
  const html = renderDelivery("waiting");
  assert.match(html, /siguiente invitación/);
  assert.doesNotMatch(html, /<button/);
  assert.match(html, /continúan/);
});
test("an empty guest list cannot start delivery and a website error can be retried", () => {
  assert.match(renderDelivery("draft", 0), /disabled=""/);
  assert.match(renderDelivery("error"), /Volver a intentar/);
});
test("import offers visible templates and a file-picker alternative to dragging", () => {
  const Import = loadSource("src/features/studio/guest-import.tsx").default;
  const html = renderToStaticMarkup(
    React.createElement(Import, { eventId: "e", onImported: async () => {} }),
  );
  assert.match(html, /Descargar plantilla Excel/);
  assert.doesNotMatch(html, /CSV/);
  assert.match(html, /Elegir archivo/);
  assert.match(html, /type="file"/);
  assert.match(html, /\.xlsx/);
});
test("roster defaults to invitation priority instead of surname and hides unsent links", () => {
  const Roster = loadSource("src/features/manager/guest-roster.tsx").default;
  const guests = [
    {
      id: "later",
      name: "Ana",
      lastName: "Alvarez",
      seats: 1,
      response: "pending",
      queuePosition: 2,
      invitationUrl: "https://private.example/later",
    },
    {
      id: "first",
      name: "Juan",
      lastName: "Zapata",
      seats: 1,
      response: "pending",
      queuePosition: 1,
      invitationUrl: "https://private.example/first",
    },
  ];
  const html = renderToStaticMarkup(
    React.createElement(Roster, {
      guests,
      plan: { tables: [], assignments: {} },
      enabled: true,
    }),
  );
  assert.ok(html.indexOf("Juan Zapata") < html.indexOf("Ana Alvarez"));
  assert.doesNotMatch(html, /https:\/\/private/);
  assert.match(html, /Esperando su turno/);
});
