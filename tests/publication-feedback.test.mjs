import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";

function harness(publish) {
  const busy = [];
  const event = { id: "one", sections: [], publishedAt: "2026-11-01" };
  const { useInvitationDesign: editorHook } = loadSource(
    "src/features/designer/use-invitation-design.ts",
    {
      mocks: {
        react: {
          useRef: (current) => ({ current }),
          useState: (initial) => [
            initial,
            (value) => {
              if (typeof value === "boolean") busy.push(value);
            },
          ],
        },
        "./use-design-history": {
          useDesignHistory: () => ({ draft: event, setDraft() {} }),
        },
        "./use-silent-design": {
          useSilentDesign: () => ({ publish, save: async () => true }),
        },
      },
    },
  );
  const editor = editorHook(event, async () => {
    throw new Error("Publication must not depend on reloading the editor");
  });
  return { editor, busy };
}

test("publication returns the server result and always clears busy", async () => {
  for (const result of [true, false]) {
    const { editor, busy } = harness(async () => result);
    assert.equal(await editor.publish(), result);
    assert.deepEqual(busy, [true, false]);
  }
});

test("double clicking update cannot submit two publications", async () => {
  let finish;
  let calls = 0;
  const { editor, busy } = harness(() => {
    calls++;
    return new Promise((resolve) => {
      finish = resolve;
    });
  });
  const pending = editor.publish();
  assert.equal(await editor.publish(), false);
  assert.equal(calls, 1);
  finish(true);
  assert.equal(await pending, true);
  assert.deepEqual(busy, [true, false]);
});
