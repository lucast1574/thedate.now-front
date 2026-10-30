import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
function harness() {
  const refs = [],
    updates = [];
  const Workspace = loadSource(
    "src/features/manager/table-guest-workspace.tsx",
    {
      mocks: {
        react: {
          useState: (initial) => [initial, (value) => updates.push(value)],
          useRef: (initial) => {
            const ref = { current: initial };
            refs.push(ref);
            return ref;
          },
          useEffect() {},
        },
      },
      globals: { window: { innerHeight: 900 } },
    },
  ).default;
  const wrapper = Workspace({
    children: null,
    plan: {},
    people: [],
    limit: 50,
    onChange() {},
  });
  refs[0].current = {
    querySelector: () => ({
      getBoundingClientRect: () => ({
        left: 0,
        right: 1000,
        top: 100,
        bottom: 800,
        width: 1000,
      }),
    }),
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
  };
  const target = {
    closest: () => ({
      getBoundingClientRect: () => ({ left: 100, right: 240, top: 160 }),
    }),
  };
  return {
    handlers: wrapper.props,
    updates,
    event: (x, y, buttons = 0) => ({
      target,
      clientX: x,
      clientY: y,
      buttons,
      detail: 1,
    }),
  };
}
test("table and space popovers stay open when the pointer moves after releasing the mouse", () => {
  const h = harness();
  h.handlers.onPointerDownCapture(h.event(100, 100, 1));
  h.handlers.onClick(h.event(100, 100));
  const position = h.updates.at(-1);
  assert.equal(typeof position.left, "number");
  h.handlers.onPointerMoveCapture(h.event(170, 110, 0));
  assert.equal(h.updates.at(-1), position);
  h.handlers.onPointerMoveCapture(h.event(300, 180, 0));
  assert.equal(h.updates.at(-1), position);
});
test("a real drag still suppresses the popover for both canvas element types", () => {
  const h = harness();
  h.handlers.onPointerDownCapture(h.event(100, 100, 1));
  h.handlers.onPointerMoveCapture(h.event(160, 140, 1));
  h.handlers.onClick(h.event(160, 140));
  assert.equal(h.updates.at(-1), null);
  assert.equal(
    h.updates.some((value) => value !== null),
    false,
  );
});
