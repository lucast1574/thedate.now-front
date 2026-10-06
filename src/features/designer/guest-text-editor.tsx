import type { FlyerElement } from "@/lib/events/flyer";
import { clamp } from "./flyer/canvas-model";
import ElementInspector from "./flyer/element-inspector";
export default function GuestTextEditor({
  item,
  onChange,
  onRemove,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="guest-text-editor">
      <p className="editor-hint">
        Cada invitado verá su nombre y apellido desde su enlace de WhatsApp.
        Conserva {"{{nombre_invitado}}"} donde deba aparecer. Área de texto: 720
        × 240.
      </p>
      <ElementInspector
        item={item}
        photos={[]}
        onChange={(patch) => {
          const next = { ...item, ...patch };
          next.width = clamp(next.width, 16, 720);
          next.height = clamp(next.height, 16, 240);
          next.x = clamp(next.x, 0, 720 - next.width);
          next.y = clamp(next.y, 0, 240 - next.height);
          next.rotation = clamp(next.rotation, -180, 180);
          onChange(next);
        }}
        onRemove={onRemove}
      />
    </div>
  );
}
