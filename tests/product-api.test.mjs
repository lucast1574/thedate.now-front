import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";

test("isolated API routes follow the request host rather than browser input", async () => {
  for (const [host, product] of [
    ["crea.thedate.now", "general"],
    ["studio.save.thedate.now", "wedding"],
    ["party.thedate.now", "general"],
    ["couple.save.thedate.now", "wedding"],
  ]) {
    let captured;
    const { backendFetch } = loadSource("src/lib/api/server.ts", {
      mocks: { "next/headers": { headers: async () => new Headers({ host }) } },
      globals: {
        process: {
          env: {
            API_PRODUCT_ISOLATION: "true",
            API_INTERNAL_URL: "http://api:8080",
          },
        },
        fetch: async (url) => {
          captured = url;
          return Response.json({});
        },
      },
    });
    await backendFetch("auth/me");
    assert.equal(captured, `http://api:8080/products/${product}/auth/me`);
  }
});

test("isolated API fails closed for an unknown host and does not double-prefix renderers", async () => {
  const { backendFetch } = loadSource("src/lib/api/server.ts", {
    mocks: {
      "next/headers": {
        headers: async () => new Headers({ host: "evil.example" }),
      },
    },
    globals: { process: { env: { API_PRODUCT_ISOLATION: "true" } } },
  });
  await assert.rejects(() => backendFetch("auth/me"), /product is required/);
  const { backendURL } = loadSource("src/lib/api/config.ts", {
    globals: {
      process: {
        env: {
          API_PRODUCT_ISOLATION: "true",
          API_INTERNAL_URL: "https://api.thedate.now/products/wedding",
        },
      },
    },
  });
  assert.equal(
    backendURL("wedding"),
    "https://api.thedate.now/products/wedding",
  );
  assert.throws(() => backendURL("general"), /another product/);
});
