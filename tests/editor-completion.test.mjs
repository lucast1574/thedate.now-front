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
function toolbar(save, isDemo = false) {
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
    canPublish: true,
    editor: {
      draft: { id: "one", title: "My day", isDemo },
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
test("publishing happens inside the editor without navigation", async () => {
  const { tree, calls } = toolbar(true);
  const finish = button(tree, "Publicar invitación");
  assert.ok(finish);
  await finish.props.onClick();
  assert.deepEqual(calls, ["publish"]);
});
test("failed saves keep the user inside the editor", async () => {
  const { tree, calls } = toolbar(false);
  await button(tree, "Publicar invitación").props.onClick();
  assert.deepEqual(calls, ["publish"]);
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
