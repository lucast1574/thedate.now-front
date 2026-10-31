import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
function button(node, text) {
  if (!node) return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = button(child, text);
      if (found) return found;
    }
    return null;
  }
  if (
    node.type === "button" &&
    JSON.stringify(node.props.children).includes(text)
  )
    return node;
  return button(node.props?.children, text);
}
function toolbar(save, isDemo = false, publishedAt = null, canPublish = true) {
  const calls = [];
  const { default: Toolbar } = loadSource(
    "src/features/designer/editor-toolbar.tsx",
    {
      mocks: {
        "next/navigation": {
          useRouter: () => ({ push: (path) => calls.push(path) }),
        },
      },
    },
  );
  const tree = Toolbar({
    canPublish,
    editor: {
      draft: { id: "one", title: "My day", isDemo, publishedAt },
      busy: false,
      dirty: false,
      save: async () => {
        calls.push("save");
        return save;
      },
      publish: async () => {
        calls.push("publish");
        return save;
      },
      setDraft() {},
      undo() {},
      redo() {},
    },
    preview: false,
    onPreview() {},
    onTemplates() {},
  });
  return { tree, calls };
}
test("finishing an unpublished invitation saves and opens guests without publishing", async () => {
  const { tree, calls } = toolbar(true);
  await button(tree, "Terminar y continuar").props.onClick();
  assert.deepEqual(calls, ["save", "/manager/one?tab=guests"]);
  assert.equal(button(tree, "Publicar invitación"), null);
});
test("failed saving keeps unfinished work in the editor", async () => {
  const { tree, calls } = toolbar(false);
  await button(tree, "Terminar y continuar").props.onClick();
  assert.deepEqual(calls, ["save"]);
});
test("published invitations update in place without navigation", async () => {
  const { tree, calls } = toolbar(true, false, "2026-01-01");
  await button(tree, "Actualizar invitación").props.onClick();
  assert.deepEqual(calls, ["publish"]);
  assert.equal(button(tree, "Terminar y continuar"), null);
});
test("collaborators can continue before publication but cannot publish updates", () => {
  assert.ok(
    button(toolbar(true, false, null, false).tree, "Terminar y continuar"),
  );
  assert.equal(
    button(
      toolbar(true, false, "2026-01-01", false).tree,
      "Actualizar invitación",
    ),
    null,
  );
});
test("demo activation keeps its own flow", () => {
  const { tree } = toolbar(true, true);
  assert.equal(button(tree, "Publicar invitación"), null);
  assert.ok(button(tree, "Activar mi invitación"));
});

test("the back chevron flushes work and leaves without confirmation", async () => {
  for (const success of [true, false]) {
    const { tree, calls } = toolbar(success);
    const link = tree.props.children[0].props.children[0];
    let prevented = false;
    await link.props.onClick({
      preventDefault() {
        prevented = true;
      },
    });
    assert.equal(prevented, true);
    assert.deepEqual(calls, success ? ["save", "/"] : ["save"]);
    assert.equal(button(tree, "Guardar diseño"), null);
  }
});
