import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";

function harness() {
  let cursor = 0,
    oldDeps,
    cleanup,
    draft = {
      mapUrl: "https://maps.app.goo.gl/first",
      isVirtual: false,
      location: "",
    };
  const slots = [],
    timers = new Map(),
    requests = new Map();
  let timerID = 0;
  const setDraft = (update) => {
    draft = typeof update === "function" ? update(draft) : update;
  };
  const { useMapAddress: mapHook } = loadSource(
    "src/features/studio/use-map-address.ts",
    {
      globals: {
        window: {
          setTimeout: (fn) => {
            timers.set(++timerID, fn);
            return timerID;
          },
          clearTimeout: (id) => timers.delete(id),
        },
      },
      mocks: {
        react: {
          useState(initial) {
            const i = cursor++;
            if (!(i in slots)) slots[i] = initial;
            return [
              slots[i],
              (next) => {
                slots[i] = typeof next === "function" ? next(slots[i]) : next;
              },
            ];
          },
          useEffect(fn, deps) {
            if (!oldDeps || deps.some((dep, i) => dep !== oldDeps[i])) {
              cleanup?.();
              oldDeps = deps;
              cleanup = fn();
            }
          },
        },
        "@/lib/api/client": {
          api: (_path, _method, { url }) =>
            new Promise((resolve, reject) =>
              requests.set(url, { resolve, reject }),
            ),
        },
      },
    },
  );
  return {
    render() {
      cursor = 0;
      return mapHook(draft, setDraft);
    },
    run() {
      const [id, fn] = [...timers][0];
      timers.delete(id);
      return fn();
    },
    set: setDraft,
    get: () => draft,
    requests,
    timers,
  };
}
test("map lookup ignores an old link response and replaces its location with the current result", async () => {
  const h = harness();
  h.render();
  const first = h.run();
  h.set({ ...h.get(), mapUrl: "https://maps.app.goo.gl/second", location: "" });
  h.render();
  const second = h.run();
  h.requests.get(h.get().mapUrl).resolve({ address: "Lugar nuevo, Lima" });
  await second;
  h.requests
    .get("https://maps.app.goo.gl/first")
    .resolve({ address: "Lugar anterior" });
  await first;
  assert.equal(h.get().location, "Lugar nuevo, Lima");
  h.render();
  assert.equal(h.timers.size, 0);
});
test("failed location lookup can be retried without changing the link", async () => {
  const h = harness();
  h.render();
  const pending = h.run();
  h.requests.get(h.get().mapUrl).reject(new Error("Temporal"));
  await pending;
  assert.equal(h.get().location, "");
  assert.match(h.render().mapStatus, /Reintenta/);
  h.render().retry();
  h.render();
  const retry = h.run();
  h.requests.get(h.get().mapUrl).resolve({ address: "Ubicación encontrada" });
  await retry;
  assert.equal(h.get().location, "Ubicación encontrada");
});
