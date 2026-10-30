import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
function harness(save = async () => true) {
  let cursor = 0,
    timerId = 0;
  const slots = [],
    effects = [],
    timers = new Map();
  const hook = loadSource("src/features/manager/use-seating-autosave.ts", {
    mocks: {
      react: {
        useRef(value) {
          const i = cursor++;
          return (slots[i] ||= { current: value });
        },
        useState(value) {
          const i = cursor++;
          if (!(i in slots)) slots[i] = value;
          return [
            slots[i],
            (next) => {
              slots[i] = next;
            },
          ];
        },
        useEffect(fn, deps) {
          const i = cursor++;
          const old = effects[i];
          if (!old || deps.some((d, j) => d !== old.deps[j])) {
            old?.cleanup?.();
            effects[i] = { deps, cleanup: fn() };
          }
        },
      },
    },
    globals: {
      setTimeout(fn, delay) {
        assert.equal(delay, 800);
        timers.set(++timerId, fn);
        return timerId;
      },
      clearTimeout: (id) => timers.delete(id),
    },
  }).useSeatingAutosave;
  const original = { version: 1, tables: [], assignments: {} };
  let props = { plan: original, dirty: true, busy: false, stale: false };
  return {
    render(patch = {}) {
      props = { ...props, ...patch };
      cursor = 0;
      return hook(props.plan, props.dirty, props.busy, props.stale, save);
    },
    async fire() {
      const [id, fn] = [...timers][0];
      timers.delete(id);
      fn();
      for (let i = 0; i < 10; i++) await Promise.resolve();
    },
    timers,
    cleanup() {
      effects.forEach((e) => e?.cleanup?.());
    },
  };
}
test("autosave debounces edits and cancels obsolete saves", async () => {
  let calls = 0;
  const h = harness(async () => {
    calls++;
    return true;
  });
  h.render();
  const first = [...h.timers.keys()][0];
  h.render({ plan: { version: 1, tables: [{ id: "new" }], assignments: {} } });
  assert.equal(h.timers.has(first), false);
  assert.equal(h.timers.size, 1);
  await h.fire();
  assert.equal(calls, 1);
  h.render({ dirty: false });
  assert.equal(h.timers.size, 0);
  h.cleanup();
});
test("autosave stops on failure, retains the draft and retries only on request", async () => {
  let calls = 0;
  const h = harness(async () => {
    calls++;
    return calls > 1;
  });
  h.render();
  await h.fire();
  const state = h.render();
  assert.equal(state.failed, true);
  assert.equal(h.timers.size, 0);
  state.retry();
  h.render();
  await h.fire();
  assert.equal(calls, 2);
  assert.equal(h.render({ dirty: false }).failed, false);
});
test("busy and conflicting plans are not automatically written", async () => {
  const h = harness();
  h.render({ busy: true });
  assert.equal(h.timers.size, 0);
  h.render({ busy: false, stale: true });
  assert.equal(h.timers.size, 0);
  h.render({ stale: false });
  assert.equal(h.timers.size, 1);
  h.cleanup();
  assert.equal(h.timers.size, 0);
});
test("an in-flight save cannot be duplicated by another render", async () => {
  let finish,
    calls = 0;
  const h = harness(() => {
    calls++;
    return new Promise((resolve) => {
      finish = resolve;
    });
  });
  h.render();
  await h.fire();
  h.render();
  assert.equal(calls, 1);
  assert.equal(h.timers.size, 0);
  finish(true);
  for (let i = 0; i < 10; i++) await Promise.resolve();
  h.render({ dirty: false });
  assert.equal(h.timers.size, 0);
});
