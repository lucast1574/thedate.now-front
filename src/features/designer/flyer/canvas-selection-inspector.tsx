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
  if (selected.locked || workspace.selectedIds.length > 1)
    return (
      <p className="canvas-panel-description">
        {selected.locked
          ? "Desbloquea el elemento para editarlo."
          : "Alinea, distribuye o agrupa la selección. Pulsa un solo elemento para editar su contenido."}
      </p>
    );
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
