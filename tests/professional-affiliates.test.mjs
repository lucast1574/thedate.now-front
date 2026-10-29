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
test("affiliate navigation belongs only to the matching professional role", () => {
  const { default: Sidebar } = loadSource(
    "src/features/studio/workspace-sidebar.tsx",
    { mocks: { "next/link": { default: "a" } } },
  );
  for (const wedding of [true, false])
    for (const role of ["user", "planner", "organizer", "admin"]) {
      const links = nodes(
        Sidebar({
          wedding,
          user: { role, name: "Test", email: "test@example.test" },
        }),
      );
      assert.equal(
        links.some((n) => n.props?.href === "/affiliates"),
        role === (wedding ? "planner" : "organizer"),
      );
    }
});
test("withdrawal asks for bank details only when the minimum is available", () => {
  const { default: Withdrawal } = loadSource(
    "src/features/account/affiliate-withdrawal.tsx",
    { mocks: { react: { useState: (v) => [v, () => {}] } } },
  );
  for (const available of [0, 500, 999, 1000, 1500]) {
    const tree = nodes(
      Withdrawal({ available, busy: false, run: async () => {} }),
    );
    assert.equal(
      tree.some((n) => n.type === "form"),
      available >= 1000,
    );
    assert.equal(
      tree.some((n) => n.type === "textarea"),
      available >= 1000,
    );
  }
});
