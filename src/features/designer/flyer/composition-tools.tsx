import { useState } from "react";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { alignSelection, elementStyle, type Alignment } from "./composition";
import Icon from "@/components/icon";
const alignments: [Alignment, string, string][] = [
  ["left", "Alinear a la izquierda", "lucide:align-start-vertical"],
  ["center-x", "Centrar horizontalmente", "lucide:align-center-vertical"],
  ["right", "Alinear a la derecha", "lucide:align-end-vertical"],
  ["top", "Alinear arriba", "lucide:align-start-horizontal"],
  ["center-y", "Centrar verticalmente", "lucide:align-center-horizontal"],
  ["bottom", "Alinear abajo", "lucide:align-end-horizontal"],
  [
    "space-x",
    "Distribuir horizontalmente",
    "lucide:align-horizontal-distribute-center",
  ],
  [
    "space-y",
    "Distribuir verticalmente",
    "lucide:align-vertical-distribute-center",
  ],
];
export default function CompositionTools({
  canvas,
  ids,
  onChange,
}: {
  canvas: FlyerCanvas;
  ids: string[];
  onChange: (canvas: FlyerCanvas) => void;
}) {
  const [style, setStyle] = useState<Partial<FlyerElement> | null>(null);
  const items = canvas.elements.filter((e) => ids.includes(e.id));
  if (!items.length) return null;
  const locked = items.every((e) => e.locked),
    grouped = items.every((e) => e.groupId && e.groupId === items[0].groupId);
  function patch(patch: Partial<FlyerElement>, includeLocked = false) {
    onChange({
      ...canvas,
      elements: canvas.elements.map((e) =>
        ids.includes(e.id) && (includeLocked || !e.locked)
          ? { ...e, ...patch }
          : e,
      ),
    });
  }
  return (
    <div className="composition-tools">
      <span>
        {items.length === 1
          ? "Organizar elemento"
          : `${items.length} elementos seleccionados`}
      </span>
      <div>
        {alignments.map(([action, label, icon]) => (
          <button
            key={action}
            title={label}
            aria-label={label}
            disabled={
              locked || (action.startsWith("space") && items.length < 3)
            }
            onClick={() => onChange(alignSelection(canvas, ids, action))}
          >
            <Icon name={icon} />
          </button>
        ))}
      </div>
      <div>
        {items.length > 1 && (
          <button
            disabled={locked}
            onClick={() =>
              patch({ groupId: grouped ? undefined : crypto.randomUUID() })
            }
          >
            {grouped ? "Desagrupar" : "Agrupar"}
          </button>
        )}
        <button
          aria-pressed={locked}
          onClick={() => patch({ locked: !locked }, true)}
        >
          <Icon name="lock" />
          {locked ? "Desbloquear" : "Bloquear"}
        </button>
        <button
          disabled={items.length !== 1}
          onClick={() => setStyle(elementStyle(items[0]))}
        >
          Copiar estilo
        </button>
        <button
          disabled={!style || locked}
          onClick={() => style && patch(style)}
        >
          Pegar estilo
        </button>
      </div>
    </div>
  );
}
