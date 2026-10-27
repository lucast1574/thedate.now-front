import CanvasProperties from "./canvas-properties";
import type { useCanvasWorkspace } from "./use-canvas-workspace";
import type { useInvitationDesign } from "../use-invitation-design";
export default function CanvasSelectionInspector({
  editor,
  workspace,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
  workspace: ReturnType<typeof useCanvasWorkspace>;
}) {
  const {
    active,
    canvas,
    selected,
    selectedId,
    patch,
    layer,
    add,
    change,
    select,
  } = workspace;
  if (!active || !selected) return null;
  return (
    <CanvasProperties
      kind={editor.draft.kind}
      canvas={canvas}
      replaceImage={(file, id) => editor.replaceImage(active.id, id, file)}
      photoURL={(key) =>
        `/api/photos/${editor.draft.id}/${encodeURIComponent(key)}`
      }
      selected={selected}
      photos={editor.draft.photoKeys}
      patch={patch}
      layer={layer}
      add={add}
      remove={() => {
        change({
          ...canvas,
          elements: canvas.elements.filter((el) => el.id !== selectedId),
        });
        select("");
      }}
    />
  );
}
