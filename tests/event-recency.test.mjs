import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { orderEvents } = loadSource("src/lib/events/event-order.ts");

test("latest opened takes precedence, then creation date; edits do not reorder events", () => {
  const events = [
    { id: "old", createdAt: "2026-01-01", updatedAt: "2026-12-31" },
    { id: "new", createdAt: "2026-10-29" },
    { id: "demo", isDemo: true, createdAt: "2026-12-01" },
  ];
  assert.deepEqual(
    Array.from(orderEvents(events), (e) => e.id),
    ["new", "old", "demo"],
  );
  assert.deepEqual(
    Array.from(orderEvents(events, "old"), (e) => e.id),
    ["old", "new", "demo"],
  );
  assert.equal(events[0].id, "old");
  assert.deepEqual(
    Array.from(orderEvents(events, "deleted"), (e) => e.id),
    ["new", "old", "demo"],
  );
});

test("opened event is remembered across screens, isolated by user and product", () => {
  const storage = new Map();
  const listeners = new Map();
  const window = {
    localStorage: {
      getItem: (k) => storage.get(k),
      setItem: (k, v) => storage.set(k, v),
    },
    addEventListener: (k, f) => listeners.set(k, f),
    removeEventListener: (k) => listeners.delete(k),
    dispatchEvent: (e) => listeners.get(e.type)?.(),
  };
  const { useEventRecency } = loadSource(
    "src/features/studio/use-event-recency.ts",
    {
      mocks: {
        react: {
          useEffect: (fn) => fn(),
          useSyncExternalStore: (subscribe, snapshot) => {
            subscribe(() => {});
            return snapshot();
          },
        },
      },
      globals: {
        window,
        Event: class {
          constructor(type) {
            this.type = type;
          }
        },
      },
    },
  );
  useEventRecency("owner", "wedding", "one");
  assert.equal(useEventRecency("owner", "wedding"), "one");
  useEventRecency("owner", "wedding", "two");
  assert.equal(useEventRecency("owner", "wedding"), "two");
  assert.equal(useEventRecency("other", "wedding"), "");
  assert.equal(useEventRecency("owner", "general"), "");
  window.localStorage.getItem = () => {
    throw Error("blocked");
  };
  window.localStorage.setItem = () => {
    throw Error("blocked");
  };
  assert.equal(useEventRecency("owner", "wedding", "three"), "");
});
