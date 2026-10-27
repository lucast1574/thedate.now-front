import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
function nodes(tree) {
  return !tree
    ? []
    : Array.isArray(tree)
      ? tree.flatMap(nodes)
      : [tree, ...nodes(tree.props?.children)];
}
test("unpaid setup exposes payment continuation without management or publication", () => {
  const { default: Workspace } = loadSource(
    "src/features/studio/event-workspace.tsx",
    {
      mocks: {
        "next/link": { default: "a" },
        "./event-form": { default: "form" },
        "./pending-payment": { default: "payment" },
      },
    },
  );
  const event = {
    id: "order",
    kind: "wedding",
    ownerId: "owner",
    paymentStatus: "pending",
  };
  const tree = Workspace({
    user: { id: "owner", role: "user" },
    events: { selected: event, draft: event },
    actions: {},
    feedback: {},
    paymentsEnabled: true,
    save: async () => {},
  });
  const all = nodes(tree);
  assert.ok(all.some((n) => n.type === "payment"));
  assert.equal(
    all.some(
      (n) =>
        n.props?.href?.startsWith("/editor/") ||
        n.props?.href?.startsWith("/manager/"),
    ),
    false,
  );
});
test("paid setup keeps a return to editing and management without the old footer", () => {
  const { default: Workspace } = loadSource(
    "src/features/studio/event-workspace.tsx",
    {
      mocks: {
        "next/link": { default: "a" },
        "./event-form": { default: "form" },
      },
    },
  );
  const event = {
    id: "paid",
    kind: "wedding",
    ownerId: "owner",
    paymentStatus: "paid",
  };
  const all = nodes(
    Workspace({
      user: { id: "owner", role: "user" },
      events: { selected: event, draft: event },
      actions: {},
      feedback: {},
      paymentsEnabled: true,
      save: async () => {},
    }),
  );
  assert.ok(all.some((n) => n.props?.href === "/editor/paid"));
  assert.ok(all.some((n) => n.props?.href === "/manager/paid"));
  assert.equal(
    all.some((n) => n.props?.id === "publicacion"),
    false,
  );
});
