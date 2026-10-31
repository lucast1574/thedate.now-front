import type { BackgroundSlice } from "@/lib/events/background";
import { useImageReplacement } from "./use-image-replacement";
import CanvasContextMenu from "./canvas-context-menu";
import { useCanvasMenu } from "./use-canvas-menu";
import { snapCenter } from "./canvas-geometry";
import { useState } from "react";
import CanvasItem from "./canvas-item";
import type { DesignEvent } from "@/lib/events/types";
import type { FlyerCanvas } from "@/lib/events/flyer";
import FlyerSurface from "@/components/flyer-surface";
import { useCanvasGesture } from "./use-canvas-gesture";
export default function CanvasEditor({
  canvas,
  selectedId,
  onSelect,
  onChange,
  photoURL,
  onReplace,
  backgroundSlice,
  event,
  editingId,
  onEditingChange,
  onEventChange,
}: {
  event?: Partial<DesignEvent>;
  editingId?: string;
  onEditingChange?: (id: string) => void;
  onEventChange?: (patch: Partial<DesignEvent>) => void;
  canvas: FlyerCanvas;
  backgroundSlice?: BackgroundSlice;
  selectedId: string;
  onSelect: (id: string) => void;
  onChange: (canvas: FlyerCanvas) => void;
  photoURL: (key: string) => string;
  onReplace?: (file: File, id: string) => Promise<void>;
}) {
  const [localEditingId, setLocalEditingId] = useState("");
  const editId = editingId ?? localEditingId;
  const edit = onEditingChange || setLocalEditingId;
  const gesture = useCanvasGesture(canvas, onChange);
  const replacement = useImageReplacement(onReplace);
  const context = useCanvasMenu(canvas, onChange, onSelect);
  const moving = gesture.transient;
  const candidate =
    moving || canvas.elements.find((item) => item.id === selectedId);
  const guides = candidate ? snapCenter(candidate, canvas, 0.1) : null;
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
        {canvas.elements.map((original, index) => {
          const item =
            gesture.transient?.id === original.id
              ? gesture.transient
              : original;
          const selected = selectedId === item.id;
          return (
            <CanvasItem
              key={item.id}
              item={item}
              original={original}
              index={index}
              selected={selected}
              canvas={canvas}
              event={event}
              photoURL={photoURL}
              gesture={gesture}
              replacement={replacement}
              context={context}
              onSelect={onSelect}
              onChange={onChange}
              editing={editId === item.id && selected}
              onEdit={edit}
              onEventChange={onEventChange}
            />
          );
        })}
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
