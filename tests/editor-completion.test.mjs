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
    finishHref: "/?event=one#publicacion",
    editor: {
      draft: { id: "one", title: "My day", isDemo },
      busy: false,
      dirty: false,
      save: async () => {
        calls.push("save");
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
test("finishing the normal editor saves before opening publication", async () => {
  const { tree, calls } = toolbar(true);
  const finish = button(tree, "Terminar y continuar");
  assert.ok(finish);
  await finish.props.onClick();
  assert.deepEqual(calls, ["save", "/?event=one#publicacion"]);
});
test("failed saves keep the user inside the editor", async () => {
  const { tree, calls } = toolbar(false);
  await button(tree, "Terminar y continuar").props.onClick();
  assert.deepEqual(calls, ["save"]);
});
test("demo activation keeps its own flow", () => {
  const { tree } = toolbar(true, true);
  assert.equal(button(tree, "Terminar y continuar"), null);
  assert.ok(button(tree, "Activar mi invitación"));
});
