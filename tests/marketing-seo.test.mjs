import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
function context(host, pinned = null) {
  return {
    mocks: {
      "next/headers": { headers: async () => new Headers({ host }) },
      "@/lib/events/invitation-runtime": { invitationTarget: () => pinned },
    },
  };
}
test("marketing crawl rules expose only the landing on its own product host", async () => {
  for (const host of ["thedate.now", "save.thedate.now:3000"]) {
    const origin = `https://${host.replace(/:\d+$/, "")}`;
    const options = context(host);
    const robots = await loadSource("src/app/robots.ts", options).default();
    const sitemap = await loadSource("src/app/sitemap.ts", options).default();
    assert.equal(robots.sitemap, `${origin}/sitemap.xml`);
    assert.ok(robots.rules.disallow.includes("/rsvp/"));
    assert.ok(robots.rules.disallow.includes("/api/"));
    assert.equal(sitemap.length, 2);
    assert.ok(sitemap[1].url.startsWith(origin + "/invitaciones-digitales-"));
    assert.equal(sitemap[0].url, `${origin}/`);
  }
});
test("private studios, invitations and lookalike hosts never expose a marketing sitemap", async () => {
  for (const host of [
    "studio.save.thedate.now",
    "crea.thedate.now",
    "ana.save.thedate.now",
    "thedate.now.evil.test",
    "localhost:3000",
  ]) {
    const options = context(host);
    assert.equal(
      (await loadSource("src/app/robots.ts", options).default()).rules.disallow,
      "/",
    );
    assert.equal(
      (await loadSource("src/app/sitemap.ts", options).default()).length,
      0,
    );
  }
  assert.equal(
    await loadSource(
      "src/features/marketing/public-origin.ts",
      context("thedate.now", {
        kind: "general",
        slug: "ana",
        eventId: "event",
      }),
    ).publicOrigin(),
    null,
  );
});
test("the two brands have distinct canonical URLs and social images", () => {
  const { landingMetadata } = loadSource("src/features/marketing/metadata.ts");
  const wedding = landingMetadata(true);
  const event = landingMetadata(false);
  assert.equal(wedding.alternates.canonical, "https://save.thedate.now/");
  assert.equal(event.alternates.canonical, "https://thedate.now/");
  assert.notEqual(wedding.title, event.title);
  assert.notEqual(
    wedding.openGraph.images[0].url,
    event.openGraph.images[0].url,
  );
  assert.equal(wedding.robots.index, true);
  assert.equal(event.twitter.card, "summary_large_image");
});
