import { elementValue } from "@/lib/events/element-values";
import { fitDressCanvas } from "@/lib/events/dress-layout";
import { moveSelection } from "./composition";
import CanvasItems from "./canvas-items";
import type { BackgroundSlice } from "@/lib/events/background";
import { useImageReplacement } from "./use-image-replacement";
import CanvasContextMenu from "./canvas-context-menu";
import { useCanvasMenu } from "./use-canvas-menu";
import { snapCenter } from "./canvas-geometry";
import type { KeyboardEvent } from "react";
import type { FlyerCanvas } from "@/lib/events/flyer";
import FlyerSurface from "@/components/flyer-surface";
import { useCanvasGesture } from "./use-canvas-gesture";
export default function CanvasEditor({
  canvas: authoredCanvas,
  selectedId,
  selectedIds = [selectedId],
  onSelect,
  onChange,
  photoURL,
  onReplace,
  backgroundSlice,
  event,
}: {
  event?: Partial<import("@/lib/events/types").PublicEvent>;
  canvas: FlyerCanvas;
  backgroundSlice?: BackgroundSlice;
  selectedId: string;
  selectedIds?: string[];
  onSelect: (id: string, multiple?: boolean) => void;
  onChange: (canvas: FlyerCanvas) => void;
  photoURL: (key: string) => string;
  onReplace?: (file: File, id: string) => Promise<void>;
}) {
  const canvas = fitDressCanvas({
    ...authoredCanvas,
    elements: authoredCanvas.elements.map((e) => elementValue(e, event)),
  });
  const gesture = useCanvasGesture(canvas, onChange, selectedIds);
  const replacement = useImageReplacement(onReplace);
  const context = useCanvasMenu(canvas, onChange, onSelect);
  const moving = gesture.transient;
  const candidate =
    moving || canvas.elements.find((item) => item.id === selectedId);
  const guides = candidate ? snapCenter(candidate, canvas, 0.1) : null;
  function keyboard(e: KeyboardEvent, id: string) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onSelect("");
      return;
    }
    const ids = selectedIds.includes(id) ? selectedIds : [id];
    const keys: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      onChange({
        ...canvas,
        elements: canvas.elements.filter(
          (el) => !ids.includes(el.id) || el.locked,
        ),
      });
      onSelect("");
    } else if (keys[e.key]) {
      e.preventDefault();
      const [dx, dy] = keys[e.key];
      const step = e.shiftKey ? 10 : 1;
      onChange(moveSelection(canvas, ids, dx * step, dy * step));
    }
  }
  return (
    <div className="canvas-editor" onClick={() => onSelect("")}>
      {replacement.input}
      <FlyerSurface
        canvas={canvas}
        photoURL={photoURL}
        backgroundSlice={backgroundSlice}
        label="Lienzo editable"
      >
        {moving && guides?.vertical && (
          <div className="canvas-guide is-vertical" aria-hidden="true" />
        )}
        {moving && guides?.horizontal && (
          <div className="canvas-guide is-horizontal" aria-hidden="true" />
        )}
        {guides && (guides.vertical || guides.horizontal) && (
          <span className="canvas-center-label">Centrado</span>
        )}
        <CanvasItems
          canvas={gesture.preview || canvas}
          originalCanvas={canvas}
          selectedIds={selectedIds}
          onSelect={onSelect}
          gesture={gesture}
          replacement={replacement}
          context={context}
          keyboard={keyboard}
          event={event}
          photoURL={photoURL}
        />
      </FlyerSurface>
      {context.menu && (
        <CanvasContextMenu
          position={context.menu}
          onCommand={context.command}
          onClose={context.close}
        />
      )}
    </div>
  );
}
