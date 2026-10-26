import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";

test("each studio uses its own Google client and secret", () => {
  const { googleConfig, googleEnabled } = loadSource("src/lib/auth/google.ts", {
    globals: {
      process: {
        env: {
          GOOGLE_GENERAL_CLIENT_ID: "events-client",
          GOOGLE_GENERAL_CLIENT_SECRET: "events-secret",
          GOOGLE_WEDDING_CLIENT_ID: "wedding-client",
          GOOGLE_WEDDING_CLIENT_SECRET: "wedding-secret",
          GOOGLE_CLIENT_ID: "old-client",
          GOOGLE_CLIENT_SECRET: "old-secret",
        },
      },
    },
  });
  assert.equal(googleConfig("crea.thedate.now").clientId, "events-client");
  assert.equal(
    googleConfig("studio.save.thedate.now").clientSecret,
    "wedding-secret",
  );
  assert.equal(googleEnabled("crea.thedate.now.evil.test"), false);
  assert.equal(googleEnabled("thedate.now"), false);
});

test("a missing product client cannot fall back to the other or legacy client", () => {
  const { googleEnabled } = loadSource("src/lib/auth/google.ts", {
    globals: {
      process: {
        env: {
          GOOGLE_GENERAL_CLIENT_ID: "events-client",
          GOOGLE_GENERAL_CLIENT_SECRET: "events-secret",
          GOOGLE_CLIENT_ID: "old-client",
          GOOGLE_CLIENT_SECRET: "old-secret",
        },
      },
    },
  });
  assert.equal(googleEnabled("crea.thedate.now"), true);
  assert.equal(googleEnabled("studio.save.thedate.now"), false);
});
