import CanvasFormatting from "./canvas-formatting";
import { directTextMode } from "./direct-text";
import { canvasCommand } from "./canvas-commands";
import { useImageReplacement } from "./use-image-replacement";
import { sectionCanvas } from "./canvas-model";
import type { FlyerElement } from "@/lib/events/flyer";
import type { DesignSection } from "@/lib/events/types";
import type { useInvitationDesign } from "../use-invitation-design";
export default function CanvasSelectionTools({
  editor,
  active,
  index: activeIndex,
  selected,
  patch,
  onSelect,
  onEdit,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
  active: DesignSection;
  index: number;
  selected: FlyerElement;
  patch: (patch: Partial<FlyerElement>) => void;
  onSelect: (page: string, element: string) => void;
  onEdit: (id: string) => void;
}) {
  const { draft } = editor;
  const replacement = useImageReplacement((file, id) =>
    editor.replaceImage(active.id, id, file),
  );
  function command(action: "duplicate" | "delete") {
    if (!active || !selected) return;
    const id = action === "duplicate" ? crypto.randomUUID() : "";
    editor.updateSection(activeIndex, {
      canvas: canvasCommand(
        sectionCanvas(active, draft),
        selected.id,
        action,
        id,
      ),
    });
    onSelect(active.id, id);
  }
  return (
    <>
      {replacement.input}{" "}
      <CanvasFormatting
        item={selected}
        onChange={patch}
        onEdit={
          directTextMode(selected) ? () => onEdit(selected.id) : undefined
        }
        onReplace={
          selected.type === "image"
            ? () => replacement.request(selected.id)
            : undefined
        }
        onDuplicate={() => command("duplicate")}
        onRemove={() => command("delete")}
        canDuplicate={sectionCanvas(active, draft).elements.length < 60}
      />
    </>
  );
}
