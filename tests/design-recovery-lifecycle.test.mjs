import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";

function harness() {
  const values = [],
    effects = [],
    timers = new Map(),
    storage = new Map();
  let cursor = 0,
    timerId = 0;
  const listeners = new Map();
  const event = {
    id: "one",
    kind: "general",
    title: "Server",
    description: "",
    template: "classic",
    accentColor: "#112233",
    sections: [],
    photoKeys: [],
  };
  const { recoveryRecord, recoveryKey } = loadSource(
    "src/features/designer/design-recovery.ts",
  );
  const key = recoveryKey(event);
  storage.set(key, recoveryRecord({ ...event, title: "Recovered" }, event));
  const { useDesignRecovery } = loadSource(
    "src/features/designer/use-design-recovery.ts",
    {
      mocks: {
        react: {
          useState(initial) {
            const i = cursor++;
            if (!(i in values)) values[i] = initial;
            return [
              values[i],
              (value) => {
                values[i] = value;
              },
            ];
          },
          useEffect(callback, dependencies) {
            const i = cursor++;
            const previous = effects[i];
            if (
              !previous ||
              dependencies.some(
                (value, n) => value !== previous.dependencies[n],
              )
            ) {
              previous?.cleanup?.();
              effects[i] = { dependencies, callback };
            }
          },
        },
      },
      globals: {
        localStorage: {
          getItem: (key) => storage.get(key),
          setItem: (key, value) => storage.set(key, value),
          removeItem: (key) => storage.delete(key),
        },
        window: {
          setTimeout(callback) {
            timers.set(++timerId, callback);
            return timerId;
          },
          clearTimeout: (id) => timers.delete(id),
          addEventListener: (name, callback) => listeners.set(name, callback),
          removeEventListener: (name) => listeners.delete(name),
        },
        document: { addEventListener() {}, removeEventListener() {} },
      },
    },
  );
  let draft = event;
  return {
    key,
    storage,
    listeners,
    Render() {
      cursor = 0;
      const result = useDesignRecovery(
        event,
        draft,
        (next) => {
          draft = next;
        },
        draft !== event,
      );
      for (const effect of effects)
        if (effect?.callback) {
          const callback = effect.callback;
          delete effect.callback;
          effect.cleanup = callback();
        }
      return result;
    },
    tick() {
      const callbacks = [...timers.values()];
      timers.clear();
      callbacks.forEach((callback) => callback());
    },
  };
}

test("recovery waits for a decision and saves edits locally without a network call", () => {
  const h = harness();
  assert.equal(h.Render().ready, false);
  h.tick();
  const recovery = h.Render();
  assert.equal(recovery.pending.title, "Recovered");
  h.tick();
  assert.ok(h.storage.has(h.key));
  recovery.resolve(true);
  h.Render();
  h.tick();
  assert.match(h.Render().status, /Copia guardada/);
  assert.equal(JSON.parse(h.storage.get(h.key)).draft.title, "Recovered");
  assert.ok(h.listeners.has("pagehide"));
});

test("discard keeps the server version and removes the old copy", () => {
  const h = harness();
  h.Render();
  h.tick();
  h.Render().resolve(false);
  h.Render();
  h.tick();
  assert.equal(h.storage.has(h.key), false);
});
