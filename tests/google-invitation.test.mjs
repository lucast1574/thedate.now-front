import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";

test("Google invitation login suggests the invited email and preserves the return path", async () => {
  const savedCookies = new Map();
  const next = `/join/${"a".repeat(48)}`;
  const { GET } = loadSource("src/app/api/auth/google/start/route.ts", {
    mocks: {
      "@/lib/auth/google": {
        googleConfig: () => ({ clientId: "local-client" }),
        callbackFor: () => "https://crea.thedate.now/api/auth/google/callback",
      },
      "next/headers": {
        cookies: async () => ({
          set(name, value) {
            savedCookies.set(name, value);
          },
        }),
      },
    },
  });
  for (const email of ["invite@example.test", "", "invalid", "a".repeat(255)]) {
    const response = await GET(
      new Request(
        `https://crea.thedate.now/api/auth/google/start?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`,
      ),
    );
    const target = new URL(response.headers.get("location"));
    assert.equal(
      target.searchParams.get("login_hint"),
      email === "invite@example.test" ? email : null,
    );
    assert.equal(target.searchParams.get("scope"), "openid email profile");
    assert.ok(target.searchParams.get("state"));
    assert.equal(savedCookies.get("thedate_google_next"), next);
  }
});
