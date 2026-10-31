import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
function harness(fail = false) {
  const refs = [];
  let cursor = 0;
  const effects = [];
  const requests = [];
  const storage = new Map();
  const errors = [];
  const timers = [];
  const event = {
    id: "one",
    kind: "wedding",
    title: "Original",
    description: "",
    template: "classic",
    accentColor: "#112233",
    sections: [],
    photoKeys: [],
    publishedAt: "2026-01-01",
  };
  const { useSilentDesign: runHook } = loadSource(
    "src/features/designer/use-silent-design.ts",
    {
      mocks: {
        react: {
          useRef(value) {
            const i = cursor++;
            return (refs[i] ||= { current: value });
          },
          useEffect(fn) {
            effects.push(fn);
          },
        },
        "@/lib/api/client": {
          api: async (...args) => {
            requests.push(args);
            if (fail) throw new Error("Sin conexión");
            return { designVersion: requests.length };
          },
        },
      },
      globals: {
        document: {
          visibilityState: "visible",
          addEventListener() {},
          removeEventListener() {},
        },
        localStorage: { setItem: (key, value) => storage.set(key, value) },
        window: {
          setTimeout: (fn) => {
            timers.push(fn);
            return timers.length;
          },
          clearTimeout() {},
          addEventListener() {},
          removeEventListener() {},
        },
      },
    },
  );
  function render(draft) {
    cursor = 0;
    const hook = runHook(draft, event, (message) => errors.push(message));
    effects.splice(0).forEach((fn) => fn());
    return hook;
  }
  return { event, render, requests, errors, storage };
}
test("automatic save is silent and does not publish", async () => {
  const h = harness();
  const editor = h.render({ ...h.event, title: "Working" });
  assert.equal(await editor.save(), true);
  assert.equal(h.requests.length, 1);
  assert.match(h.requests[0][0], /\/design$/);
  assert.equal(h.requests[0][2].expectedVersion, 0);
  assert.deepEqual(h.errors, [""]);
});
test("rapid edits during a save are serialized before leaving", async () => {
  const h = harness();
  const first = h.render({ ...h.event, title: "First" });
  const saving = first.save();
  h.render({ ...h.event, title: "Latest" });
  assert.equal(await saving, true);
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[1][2].title, "Latest");
  assert.equal(h.requests[1][2].expectedVersion, 1);
});
test("explicit update saves first then publishes the saved version", async () => {
  const h = harness();
  const editor = h.render({ ...h.event, title: "Ready" });
  await editor.publish();
  assert.equal(h.requests.length, 2);
  assert.match(h.requests[1][0], /design\/publish$/);
  assert.equal(h.requests[1][2].expectedVersion, 1);
});

test("a local recovery resumes silently only for the matching server version", () => {
  const stored = { version: 4, draft: { id: "one", title: "Unfinished" } };
  const { restoreDesign } = loadSource(
    "src/features/designer/silent-recovery.ts",
    { globals: { localStorage: { getItem: () => JSON.stringify(stored) } } },
  );
  const fallback = { id: "one", title: "Server", designVersion: 4 };
  assert.equal(restoreDesign(fallback, fallback).title, "Unfinished");
  assert.equal(
    restoreDesign({ ...fallback, designVersion: 5 }, fallback),
    fallback,
  );
});

test("failed saving retains work and blocks publication", async () => {
  const h = harness(true);
  const editor = h.render({ ...h.event, title: "Keep this work" });
  assert.equal(await editor.publish(), false);
  assert.equal(h.requests.length, 1);
  assert.match(h.errors.at(-1), /No pudimos guardar/);
  assert.equal(
    JSON.parse([...h.storage.values()][0]).draft.title,
    "Keep this work",
  );
});

test("the editor cannot initiate the first deployment", async () => {
  const h = harness();
  h.event.publishedAt = null;
  const editor = h.render({ ...h.event, title: "Unfinished" });
  assert.equal(await editor.publish(), false);
  assert.equal(h.requests.length, 0);
});
