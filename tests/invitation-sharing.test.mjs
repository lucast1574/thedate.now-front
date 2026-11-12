import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const event = {
  id: "event",
  kind: "general",
  slug: "celebracion",
  title: "Acción de Gracias",
  startAt: "2026-11-29T00:00:00Z",
  timeZone: "America/Lima",
  accentColor: "#247785",
  sections: [],
  photoKeys: [],
};

test("share metadata describes the published event without personal tokens", () => {
  const { shareMetadata } = loadSource(
    "src/features/invitations/share-metadata.ts",
  );
  const meta = shareMetadata(event);
  assert.match(meta.title, /Acción de Gracias/);
  assert.equal(meta.openGraph.url, "https://celebracion.thedate.now");
  assert.equal(meta.twitter.card, "summary_large_image");
  assert.match(
    meta.openGraph.images[0].url,
    /\/api\/invitation-preview\?v=[a-f0-9]+$/,
  );
  assert.equal(meta.robots.index, false);
  assert.notEqual(
    shareMetadata({ ...event, sections: [{ id: "changed" }] }).openGraph
      .images[0].url,
    meta.openGraph.images[0].url,
  );
  assert.match(
    shareMetadata({ ...event, kind: "wedding" }).openGraph.url,
    /\.save\.thedate\.now$/,
  );
});

test("preview resolution refuses another event and never queries a studio host", async () => {
  let requests = 0;
  const { shareEvent } = loadSource(
    "src/features/invitations/share-metadata.ts",
    {
      mocks: {
        "./load-invitation": {
          findEvent: async () => {
            requests++;
            return event;
          },
        },
        "@/lib/events/invitation-runtime": {
          invitationTarget: () => ({
            kind: "general",
            slug: "celebracion",
            eventId: "another-event",
          }),
        },
      },
    },
  );
  assert.equal(await shareEvent("crea.thedate.now"), null);
  assert.equal(requests, 0);
  assert.equal(await shareEvent("other.thedate.now"), null);
  assert.equal(requests, 0);
  assert.equal(await shareEvent("celebracion.thedate.now"), null);
  assert.equal(requests, 1);
});

test("the share cover renders a readable PNG even without uploaded photos", async () => {
  const { default: ShareCover } = loadSource(
    "src/features/invitations/share-cover.tsx",
  );
  const { ImageResponse } = await import("next/og.js");
  const response = new ImageResponse(ShareCover({ event, photos: {} }), {
    width: 1200,
    height: 630,
  });
  const png = Buffer.from(await response.arrayBuffer());
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
