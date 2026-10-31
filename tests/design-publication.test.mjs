import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";

function Editor({ failSave = false, failPublish = false } = {}) {
  const calls = [];
  const event = {
    id: "one",
    kind: "general",
    title: "Our celebration",
    description: "",
    template: "classic",
    accentColor: "#112233",
    sections: [],
    photoKeys: [],
    publishedAt: "2026-10-30",
    designVersion: 2,
    publishedDesignVersion: 1,
  };
  const { useInvitationDesign } = loadSource(
    "src/features/designer/use-invitation-design.ts",
    {
      mocks: {
        react: { useState: (value) => [value, () => {}] },
        "./use-design-history": {
          useDesignHistory: () => ({
            draft: event,
            dirty: true,
            setDraft() {},
          }),
        },
        "./use-design-recovery": { useDesignRecovery: () => ({ ready: true }) },
        "@/lib/api/client": {
          api: async (path, method, body) => {
            calls.push({ path, method, body });
            if (method === "PATCH" && failSave) throw new Error("Save failed");
            if (method === "POST" && failPublish)
              throw new Error("Publish failed");
            return { designVersion: 3 };
          },
        },
      },
    },
  );
  return {
    calls,
    instance: useInvitationDesign(event, async () => {
      calls.push("reload");
    }),
  };
}

test("save persists a versioned draft without publishing", async () => {
  const { instance, calls } = Editor();
  assert.equal(await instance.save(), true);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].method, "PATCH");
  assert.equal(calls[0].body.expectedVersion, 2);
  assert.equal(calls[1], "reload");
  assert.equal(instance.unpublishedChanges, true);
});

test("explicit publication saves first and publishes exactly the saved revision", async () => {
  const { instance, calls } = Editor();
  assert.equal(await instance.publish(), true);
  assert.equal(calls[0].method, "PATCH");
  assert.equal(calls[1], "reload");
  assert.equal(calls[2].path, "/api/backend/events/one/design/publish");
  assert.equal(calls[2].body.expectedVersion, 3);
  assert.equal(calls[3], "reload");
});

test("a failed save never publishes and a failed publication reports failure", async () => {
  const first = Editor({ failSave: true });
  assert.equal(await first.instance.publish(), false);
  assert.equal(first.calls.length, 1);
  const second = Editor({ failPublish: true });
  assert.equal(await second.instance.publish(), false);
  assert.equal(second.calls.at(-1).method, "POST");
});
