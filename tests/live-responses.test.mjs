import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { loadSource } = require("./support/load-source.cjs");

function harness(enabled = true, refresh = async () => {}) {
  const listeners = new Map(),
    timers = new Map(),
    errors = [];
  const document = {
    hidden: false,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
  };
  const navigator = { onLine: true };
  let cleanup,
    next = 0;
  const { useLiveResponses: mountResponses } = loadSource(
    "src/features/manager/use-live-responses.ts",
    {
      mocks: {
        react: {
          useEffect: (effect) => {
            cleanup = effect();
          },
        },
      },
      globals: {
        document,
        navigator,
        window: document,
        setTimeout: (fn, delay) => {
          timers.set(++next, { fn, delay });
          return next;
        },
        clearTimeout: (id) => timers.delete(id),
      },
    },
  );
  mountResponses(enabled, refresh, (message) => errors.push(message));
  return {
    listeners,
    timers,
    errors,
    document,
    navigator,
    cleanup: () => cleanup?.(),
  };
}

test("live responses wait for the previous request and clean up timers and listeners", async () => {
  let finish,
    calls = 0;
  const h = harness(true, () => {
    calls++;
    return new Promise((resolve) => {
      finish = resolve;
    });
  });
  assert.equal([...h.timers.values()][0].delay, 5000);
  const pending = h.listeners.get("focus")();
  await h.listeners.get("online")();
  assert.equal(calls, 1);
  assert.equal(h.timers.size, 0);
  finish();
  await pending;
  assert.equal(h.timers.size, 1);
  h.cleanup();
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

test("live responses skip hidden or offline tabs and resume on return", async () => {
  let calls = 0;
  const h = harness(true, async () => {
    calls++;
  });
  h.document.hidden = true;
  await h.listeners.get("visibilitychange")();
  h.document.hidden = false;
  h.navigator.onLine = false;
  await h.listeners.get("focus")();
  assert.equal(calls, 0);
  h.navigator.onLine = true;
  await h.listeners.get("online")();
  assert.equal(calls, 1);
  h.cleanup();
});

test("live responses retry after failures and stay disabled for inactive events", async () => {
  const inactive = harness(false);
  assert.equal(inactive.timers.size, 0);
  assert.equal(inactive.listeners.size, 0);
  const h = harness(true, async () => {
    throw new Error("Sin conexión");
  });
  await h.listeners.get("focus")();
  assert.deepEqual(h.errors, ["Sin conexión"]);
  assert.equal(h.timers.size, 1);
  h.cleanup();
});
