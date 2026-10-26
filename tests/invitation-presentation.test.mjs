import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { default: Invitation } = loadSource(
  "src/features/invitations/invitation.tsx",
);
const { invitationPaper } = loadSource("src/lib/events/invitation-paper.ts");
const event = {
  id: "invitation",
  kind: "wedding",
  title: "Not automatically printed",
  description: "Not automatically printed either",
  template: "classic",
  accentColor: "#A76F51",
  designMode: "flyer",
  photoKeys: [],
  startAt: "2027-01-01T18:00:00Z",
  timeZone: "America/Lima",
  location: "Venue not added to the design",
  organizer: "Host not added to the design",
  mapUrl: "https://maps.google.com/?q=Lima",
  sections: [
    {
      id: "page",
      heading: "My page",
      icon: "none",
      body: "",
      canvas: {
        width: 720,
        height: 960,
        background: "#123456",
        elements: [
          {
            id: "custom",
            type: "text",
            text: "Mi propia bienvenida y despedida",
            x: 40,
            y: 40,
            width: 600,
            height: 100,
            rotation: 0,
            font: "serif",
            fontSize: 32,
            color: "#FFFFFF",
            align: "center",
          },
        ],
      },
    },
  ],
};
test("both products print only authored canvas content and a linked brand credit", () => {
  for (const kind of ["wedding", "general"]) {
    const html = renderToStaticMarkup(
      createElement(Invitation, {
        event: { ...event, kind },
        guestName: "Guest not added to the design",
      }),
    );
    assert.match(html, /Mi propia bienvenida y despedida/);
    assert.doesNotMatch(
      html,
      /Not automatically|Venue not added|Host not added|Guest not added/,
    );
    assert.doesNotMatch(
      html,
      /<header|Nos encantará|Cómo llegar|UNA INVITACIÓN|CELEBREMOS EL AMOR|Creada con/,
    );
    assert.equal((html.match(/<footer/g) || []).length, 1);
    assert.match(
      html,
      kind === "wedding"
        ? /href="https:\/\/save\.thedate\.now"/
        : /href="https:\/\/thedate\.now"/,
    );
    assert.match(html, /--invite-paper:#123456/);
  }
});
test("the gift link is optional and preserves the selected personal destination", () => {
  for (const wishlistEnabled of [false, true]) {
    const html = renderToStaticMarkup(
      createElement(Invitation, {
        event: { ...event, wishlistEnabled },
        giftURL: "/regalos/personal-code",
      }),
    );
    assert.equal(html.includes("Lista de regalos"), wishlistEnabled);
    assert.equal(
      html.includes('href="/regalos/personal-code"'),
      wishlistEnabled,
    );
  }
});
test("brand credit can follow the RSVP form without appearing twice", () => {
  const html = renderToStaticMarkup(
    createElement(Invitation, { event, showBrand: false }),
  );
  assert.doesNotMatch(html, /<footer|save\.thedate\.now/);
  assert.match(html, /Mi propia bienvenida y despedida/);
});
test("the footer follows the last canvas background and remains readable", () => {
  for (const [background, ink] of [
    ["#FFFFFF", "#242424"],
    ["#000000", "#FFFFFF"],
    ["#123456", "#FFFFFF"],
    ["#FFFF00", "#242424"],
  ]) {
    const result = invitationPaper({
      ...event,
      sections: [...event.sections, { canvas: { background } }],
    });
    assert.equal(result.background, "#123456");
    assert.equal(result.footer, background);
    assert.equal(result.ink, ink);
  }
  assert.equal(
    invitationPaper({ ...event, sections: [] }).background,
    "#FFF9ED",
  );
  assert.equal(
    invitationPaper({ ...event, kind: "general", sections: [] }).background,
    "#FFFFFF",
  );
});
