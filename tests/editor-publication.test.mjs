import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

function toolbar(isPublished, canPublish = true) {
  const calls = [];
  const { default: EditorToolbar } = loadSource(
    "src/features/designer/editor-toolbar.tsx",
    {
      mocks: {
        "next/navigation": {
          useRouter: () => ({ push: (path) => calls.push(path) }),
        },
        "next/link": { default: "a" },
        "./publication-feedback": {
          usePublicationFeedback: () => () => calls.push("feedback"),
        },
      },
    },
  );
  const tree = EditorToolbar({
    editor: {
      draft: {
        id: "event",
        title: "Living Hope",
        kind: "general",
        // Simulate a stale history entry with the opposite publication state.
        publishedAt: isPublished ? null : "2026-11-12T19:16:02Z",
      },
      isPublished,
      save: async () => {
        calls.push("save");
        return true;
      },
      publish: async () => {
        calls.push("publish");
        return true;
      },
    },
    canPublish,
    preview: false,
    onPreview() {},
    onTemplates() {},
  });
  function find(node) {
    if (!node || typeof node !== "object") return null;
    if (node.props?.className === "editor-save editor-finish") return node;
    const children = node.props?.children;
    for (const child of Array.isArray(children) ? children : [children]) {
      const result = find(child);
      if (result) return result;
    }
    return null;
  }
  return { calls, button: find(tree) };
}

test("published invitations update the design despite stale draft metadata", async () => {
  const { button, calls } = toolbar(true);
  assert.match(renderToStaticMarkup(button), /Actualizar y continuar/);
  await button.props.onClick();
  assert.deepEqual(calls, ["publish", "feedback", "/"]);
});

test("unpublished invitations save and continue to guests without publishing", async () => {
  const { button, calls } = toolbar(false);
  assert.match(renderToStaticMarkup(button), /Terminar y continuar/);
  await button.props.onClick();
  assert.deepEqual(calls, ["save", "/manager/event?tab=guests"]);
});

test("a stale draft cannot expose publication to a collaborator", () => {
  assert.equal(toolbar(true, false).button, null);
});
