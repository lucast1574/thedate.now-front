import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";

test("ticket retry keeps its submission identifier until the draft changes", () => {
  const { submissionFor } = loadSource("src/lib/support/types.ts");
  let next = 0;
  const id = () => String(++next);
  const first = submissionFor(null, "draft", id);
  assert.equal(submissionFor(first, "draft", id), first);
  assert.equal(submissionFor(first, "edited draft", id).key, "2");
});

test("request size limits count bytes rather than Unicode characters", async () => {
  const { readRequestText, RequestBodyTooLarge } = loadSource(
    "src/lib/api/request-body.ts",
  );
  const request = () =>
    new Request("https://example.test", { method: "POST", body: "áá" });
  assert.equal(await readRequestText(request(), 4), "áá");
  await assert.rejects(readRequestText(request(), 3), RequestBodyTooLarge);
});

test("ticket proxy preserves pagination and prevents caching private reports", async () => {
  let captured;
  const { proxyStudio } = loadSource("src/lib/api/studio-proxy.ts", {
    mocks: {
      "next/headers": {
        cookies: async () => ({ get: () => ({ value: "session" }) }),
      },
    },
    globals: {
      fetch: async (url) => {
        captured = url;
        return Response.json({ items: [] });
      },
    },
  });
  const result = await proxyStudio(
    new Request(
      "https://crea.thedate.now/api/backend/support/tickets?state=DONE&page=2",
    ),
    ["support", "tickets"],
    "GET",
  );
  assert.equal(
    captured,
    "https://api.thedate.now/support/tickets?state=DONE&page=2",
  );
  assert.equal(result.headers.get("Cache-Control"), "private, no-store");
});

test("screenshot route authenticates, bounds indexes and streams private binary data", async () => {
  let token = "session",
    calls = 0;
  const { GET } = loadSource(
    "src/app/api/support/[id]/images/[index]/route.ts",
    {
      mocks: {
        "@/lib/auth/session": { sessionToken: async () => token },
        "@/lib/api/server": {
          bearer: (value) => ({ Authorization: `Bearer ${value}` }),
          backendFetch: async () => {
            calls++;
            return new Response(new Uint8Array([1, 2, 3]), {
              headers: { "Content-Type": "image/png" },
            });
          },
        },
      },
    },
  );
  const request = new Request(
    "https://crea.thedate.now/api/support/id/images/0",
  );
  const params = (index) => ({
    params: Promise.resolve({ id: "ticket-id", index }),
  });
  const image = await GET(request, params("0"));
  assert.deepEqual([...new Uint8Array(await image.arrayBuffer())], [1, 2, 3]);
  assert.equal(image.headers.get("Cache-Control"), "private, no-store");
  assert.equal(image.headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal((await GET(request, params("3"))).status, 404);
  token = "";
  assert.equal((await GET(request, params("0"))).status, 401);
  assert.equal(calls, 1);
});
