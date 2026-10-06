import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

test("personal links reject another host, pinned event, and malformed tokens", async () => {
  const { validInviteToken } = loadSource("src/lib/api/server.ts");
  let calls = 0;
  const page = (host, pinned, event) =>
    loadSource("src/features/invitations/personal-invitation.tsx", {
      mocks: {
        "next/headers": { headers: async () => new Headers({ host }) },
        "next/navigation": {
          notFound: () => {
            throw new Error("Not found");
          },
        },
        "@/lib/api/server": {
          validInviteToken,
          backendFetch: async () => {
            calls++;
            return Response.json({ event, guestName: "Ana Rojas" });
          },
        },
        "@/lib/events/invitation-runtime": { invitationTarget: () => pinned },
        "./live-invitation": { default: () => null },
        "./invitation": { default: () => null },
        "@/features/rsvp/rsvp-form": { default: () => null },
      },
    }).default;
  const event = { id: "our-event", kind: "wedding", slug: "our-wedding" };
  const token = "a".repeat(48);
  await assert.rejects(
    page("other-wedding.save.thedate.now", null, event)({ token }),
    /Not found/,
  );
  await assert.rejects(
    page(
      "our-wedding.save.thedate.now",
      { kind: "wedding", slug: "our-wedding", eventId: "different-event" },
      event,
    )({ token }),
    /Not found/,
  );
  assert.ok(
    await page(
      "our-wedding.save.thedate.now",
      { kind: "wedding", slug: "our-wedding", eventId: "our-event" },
      event,
    )({ token }),
  );
  const before = calls;
  await assert.rejects(
    page("our-wedding.save.thedate.now", null, event)({ token: "invalid" }),
    /Not found/,
  );
  assert.equal(calls, before);
});
const { guestNameElement, personalizedText } = loadSource(
  "src/lib/events/guest-name.ts",
);
const Invitation = loadSource("src/features/invitations/invitation.tsx", {
  mocks: { "next/image": ({ alt }) => createElement("img", { alt }) },
}).default;
test("recipient binding uses only the supplied name, including literal replacement characters", () => {
  const element = guestNameElement("#995d72", "name");
  assert.equal(
    personalizedText(element, " Ana $& Rojas "),
    "Hola, Ana $& Rojas",
  );
  assert.equal(personalizedText(element), "Hola, Invitado/a");
  assert.equal(
    personalizedText({ ...element, binding: undefined }, "Ana"),
    "Hola, {{nombre_invitado}}",
  );
});
test("section and flyer personalized invitations escape names and preserve their geometry", () => {
  const name = "Ana <script>alert(1)</script>";
  const guestText = guestNameElement("#995d72", "name");
  const section = {
    id: "personal",
    heading: "For you",
    icon: "none",
    body: "",
    guestText,
  };
  const event = {
    id: "event",
    slug: "party",
    kind: "wedding",
    title: "Our day",
    description: "Welcome",
    template: "classic",
    accentColor: "#995d72",
    photoKeys: [],
    sections: [section],
  };
  for (const mode of ["sections", "flyer"]) {
    const sections =
      mode === "flyer"
        ? [
            {
              ...section,
              canvas: {
                width: 720,
                height: 960,
                background: "#ffffff",
                elements: [guestText],
              },
            },
          ]
        : [section];
    const html = renderToStaticMarkup(
      createElement(Invitation, {
        event: { ...event, designMode: mode, sections },
        guestName: name,
      }),
    );
    assert.match(html, /Hola, Ana &lt;script&gt;/);
    assert.doesNotMatch(html, /<script>|\{\{nombre_invitado\}\}/);
    assert.match(html, /rotate\(0deg\)/);
  }
});
test("private invitation pages cannot leak bearer tokens through cache or referrers", () => {
  const { proxy } = loadSource("src/proxy.ts", {
    mocks: { "next/server": { NextResponse: { next: () => new Response() } } },
  });
  const response = proxy({
    nextUrl: { pathname: "/rsvp/" + "a".repeat(48) },
    headers: new Headers({ host: "party.thedate.now" }),
  });
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
});
