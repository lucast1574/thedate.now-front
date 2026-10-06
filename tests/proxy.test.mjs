import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";

function proxyFixture(
  token,
  fetchImpl = () => Response.json({ status: "ok" }),
) {
  return loadSource("src/lib/api/studio-proxy.ts", {
    mocks: {
      "next/headers": {
        cookies: async () => ({
          get: () => (token ? { value: token } : undefined),
        }),
      },
    },
    globals: { fetch: async (...args) => fetchImpl(...args) },
  }).proxyStudio;
}
function request(method = "GET", origin = "https://crea.thedate.now") {
  return new Request("https://crea.thedate.now/api/backend/events", {
    method,
    headers: { host: "crea.thedate.now", origin },
    ...(method === "GET" ? {} : { body: '{"title":"Fiesta"}' }),
  });
}

test("studio proxy rejects missing sessions, unsafe paths and foreign origins before forwarding", async () => {
  assert.equal(
    (await proxyFixture()(request(), ["events"], "GET")).status,
    401,
  );
  const proxy = proxyFixture("local-test-session", () => {
    throw new Error("must not reach backend");
  });
  assert.equal(
    (await proxy(request(), ["auth", "register"], "GET")).status,
    404,
  );
  assert.equal(
    (await proxy(request(), ["events", "..", "auth"], "GET")).status,
    404,
  );
  assert.equal(
    (await proxy(request("POST", "https://other.example"), ["events"], "POST"))
      .status,
    403,
  );
  assert.equal(
    (await proxy(request("POST", "not-a-url"), ["events"], "POST")).status,
    403,
  );
});

test("studio proxy preserves method, JSON body, authorization and upstream status", async () => {
  let captured;
  const proxy = proxyFixture("local-test-session", (url, init) => {
    captured = { url, init };
    return Response.json({ error: "Event full" }, { status: 409 });
  });
  const result = await proxy(request("POST"), ["events"], "POST");
  assert.equal(result.status, 409);
  assert.equal((await result.json()).error, "Event full");
  assert.equal(captured.url, "https://api.thedate.now/events");
  assert.equal(
    captured.init.headers.Authorization,
    "Bearer local-test-session",
  );
  assert.equal(captured.init.method, "POST");
  assert.equal(captured.init.body, '{"title":"Fiesta"}');
  assert.equal(captured.init.cache, "no-store");
});

test("backend failures become a controlled 502", async () => {
  const proxy = proxyFixture("local-test-session", async () => {
    throw new Error("offline");
  });
  assert.equal((await proxy(request(), ["events"], "GET")).status, 502);
});

test("malformed session JSON remains a 400 response", async () => {
  const { POST } = loadSource("src/app/api/session/route.ts");
  const result = await POST(
    new Request("https://crea.thedate.now/api/session", {
      method: "POST",
      body: "invalid",
    }),
  );
  assert.equal(result.status, 400);
});
