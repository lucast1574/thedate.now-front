import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const id = "b6ea72ce-c49d-4f94-ae71-0a69d23dbf1e";
test("audio upload requires session and bounds bytes before forwarding", async () => {
  let token = null,
    forwarded;
  const { POST } = loadSource("src/app/api/audio/[id]/route.ts", {
    globals: { Blob },
    mocks: {
      "@/lib/auth/session": { sessionToken: async () => token },
      "@/lib/api/server": {
        invalidOrigin: () => false,
        forwardJSON: (result) => result,
        backendFetch: async (path, init) => {
          forwarded = { path, init };
          return Response.json({ key: `${id}.mp3` }, { status: 201 });
        },
      },
    },
  });
  const context = { params: Promise.resolve({ id }) };
  let response = await POST(
    new Request("https://crea.thedate.now/api/audio/" + id, {
      method: "POST",
      body: "mp3",
    }),
    context,
  );
  assert.equal(response.status, 401);
  assert.equal(forwarded, undefined);
  token = "test-session";
  response = await POST(
    new Request("https://crea.thedate.now/api/audio/" + id, {
      method: "POST",
      body: new Uint8Array(10 * 1024 * 1024 + 1),
    }),
    context,
  );
  assert.equal(response.status, 413);
  assert.equal(forwarded, undefined);
  response = await POST(
    new Request("https://crea.thedate.now/api/audio/" + id, {
      method: "POST",
      body: "test-mp3",
    }),
    context,
  );
  assert.equal(response.status, 201);
  assert.equal(forwarded.path, `events/${id}/audio`);
  assert.equal(forwarded.init.headers.Authorization, "Bearer test-session");
  assert.equal(await forwarded.init.body.text(), "test-mp3");
});
test("public audio enforces pinned invitation and forwards byte ranges", async () => {
  let captured;
  const { GET } = loadSource(
    "src/app/api/public-audio/[kind]/[slug]/[key]/route.ts",
    {
      mocks: {
        "@/lib/events/invitation-runtime": {
          invitationTarget: () => ({ kind: "wedding", slug: "ana-y-luis" }),
        },
        "@/lib/api/server": {
          backendFetch: async (path, init) => {
            captured = { path, init };
            return new Response(new Uint8Array([1, 2, 3]), {
              status: 206,
              headers: {
                "Content-Range": "bytes 0-2/100",
                "Accept-Ranges": "bytes",
                "Content-Length": "3",
              },
            });
          },
        },
      },
    },
  );
  const request = new Request(
    "https://ana-y-luis.save.thedate.now/api/public-audio",
    { headers: { Range: "bytes=0-2" } },
  );
  let response = await GET(request, {
    params: Promise.resolve({
      kind: "wedding",
      slug: "other-couple",
      key: `${id}.mp3`,
    }),
  });
  assert.equal(response.status, 404);
  assert.equal(captured, undefined);
  response = await GET(request, {
    params: Promise.resolve({
      kind: "wedding",
      slug: "ana-y-luis",
      key: `${id}.mp3`,
    }),
  });
  assert.equal(response.status, 206);
  assert.equal(captured.init.headers.Range, "bytes=0-2");
  assert.equal(response.headers.get("Content-Range"), "bytes 0-2/100");
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
});
