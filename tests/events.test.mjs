import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";

const { invitationFromHost, invitationHost } = loadSource(
  "src/lib/events/domains.ts",
);
const { blankEvent, eventPayload, normalizeEvent } = loadSource(
  "src/lib/events/draft.ts",
);
const { formatEventDate } = loadSource("src/lib/events/date.ts");

test("wedding and general invitation addresses resolve to their own product", () => {
  for (const kind of ["general", "wedding"]) {
    const host = invitationHost(kind, "celebracion");
    const target = invitationFromHost(`${host.toUpperCase()}:3000`);
    assert.equal(target.kind, kind);
    assert.equal(target.slug, "celebracion");
  }
  for (const host of [
    "api.thedate.now",
    "save.thedate.now",
    "a.b.thedate.now",
    "invalid_host.thedate.now",
  ])
    assert.equal(invitationFromHost(host), null);
});

test("editing a persisted date preserves its instant when submitted again", () => {
  const event = {
    ...blankEvent("general"),
    startAt: "2027-01-10T18:30:00Z",
    organizer: "Lucas",
  };
  const payload = eventPayload(normalizeEvent(event));
  assert.equal(payload.startAt, new Date(event.startAt).toISOString());
  assert.equal(payload.organizer, "Lucas");
  assert.equal("id" in payload, false);
  assert.equal("paymentStatus" in payload, false);
});

test("virtual and physical event payloads do not mix location links", () => {
  const event = {
    ...blankEvent("general"),
    startAt: "2027-01-10T18:30",
    isVirtual: true,
    mapUrl: "https://maps.google.com",
    virtualUrl: "https://meet.google.com/example",
  };
  const virtual = eventPayload(event);
  assert.equal(virtual.mapUrl, "");
  assert.equal(virtual.location, "En línea");
  assert.equal(virtual.virtualUrl, event.virtualUrl);
  assert.equal(eventPayload({ ...event, isVirtual: false }).virtualUrl, "");
  assert.equal(eventPayload({ ...event, kind: "wedding" }).isVirtual, false);
});

test("date widgets handle invalid dates and format in the event timezone", () => {
  assert.equal(formatEventDate("invalid"), "Próximamente");
  assert.notEqual(
    formatEventDate("2027-01-01T01:00:00Z", "UTC"),
    formatEventDate("2027-01-01T01:00:00Z", "America/Lima"),
  );
});
