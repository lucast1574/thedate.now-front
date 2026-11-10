import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";

for (const status of [200, 202, 500]) {
  test(`account deletion clears the cookie only after API acceptance (${status})`, async () => {
    let cleared = 0;
    let target;
    const { proxyStudio } = loadSource("src/lib/api/studio-proxy.ts", {
      mocks: {
        "@/lib/auth/session": {
          sessionToken: async () => "test-session",
          clearSession: async () => {
            cleared++;
          },
        },
      },
      globals: {
        fetch: async (url, init) => {
          target = { url, init };
          return Response.json(
            { status: status === 200 ? "deleted" : "deleting" },
            { status },
          );
        },
      },
    });
    const request = new Request(
      "https://crea.thedate.now/api/backend/profile",
      {
        method: "DELETE",
        headers: {
          host: "crea.thedate.now",
          origin: "https://crea.thedate.now",
        },
      },
    );
    const response = await proxyStudio(request, ["profile"], "DELETE");
    assert.equal(response.status, status);
    assert.equal(cleared, status < 300 ? 1 : 0);
    assert.equal(target.url, "https://api.thedate.now/profile");
    assert.equal(target.init.method, "DELETE");
    assert.equal(target.init.headers.Authorization, "Bearer test-session");
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  });
}

test("Google sign-in returns to the account deletion page without accepting arbitrary URLs", () => {
  const { safeContinuation } = loadSource("src/lib/auth/continuation.ts");
  assert.equal(safeContinuation("/delete-account"), "/delete-account");
  assert.equal(safeContinuation("//other.example/delete-account"), "/");
  assert.equal(
    safeContinuation("/delete-account?redirect=https://other.example"),
    "/",
  );
});
