import { useTranslator } from "@/lib/i18n/react";
import { type Translator, localized } from "@/lib/i18n/translator";
import { useState } from "react";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { alignSelection, elementStyle, type Alignment } from "./composition";
import Icon from "@/components/icon";
const alignments = localized(
  (i18n: Translator): [Alignment, string, string][] => [
    ["left", i18n("Alinear a la izquierda"), "lucide:align-start-vertical"],
    [
      "center-x",
      i18n("Centrar horizontalmente"),
      "lucide:align-center-vertical",
    ],
    ["right", i18n("Alinear a la derecha"), "lucide:align-end-vertical"],
    ["top", i18n("Alinear arriba"), "lucide:align-start-horizontal"],
    [
      "center-y",
      i18n("Centrar verticalmente"),
      "lucide:align-center-horizontal",
    ],
    ["bottom", i18n("Alinear abajo"), "lucide:align-end-horizontal"],
    [
      "space-x",
      i18n("Distribuir horizontalmente"),
      "lucide:align-horizontal-distribute-center",
    ],
    [
      "space-y",
      i18n("Distribuir verticalmente"),
      "lucide:align-vertical-distribute-center",
    ],
  ],
);
export default function CompositionTools({
  canvas,
  ids,
  onChange,
}: {
  canvas: FlyerCanvas;
  ids: string[];
  onChange: (canvas: FlyerCanvas) => void;
}) {
  const i18n = useTranslator();

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
          ? {
              ...e,
              ...patch,
              ...(e.type !== "text"
                ? {
                    typeface: undefined,
                    italic: undefined,
                    lineHeight: undefined,
                    letterSpacing: undefined,
                  }
                : {}),
            }
          : e,
      ),
    });
  }
  return (
    <div className="composition-tools">
      <span>
        {items.length === 1
          ? i18n("Organizar elemento")
          : `${items.length} elementos seleccionados`}
      </span>
      <div>
        {alignments(i18n).map(([action, label, icon]) => (
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
            {grouped ? i18n("Desagrupar") : i18n("Agrupar")}
          </button>
        )}
        <button
          aria-pressed={locked}
          onClick={() => patch({ locked: !locked }, true)}
        >
          <Icon name="lock" />
          {locked ? i18n("Desbloquear") : i18n("Bloquear")}
        </button>
        <button
          disabled={items.length !== 1}
          onClick={() => setStyle(elementStyle(items[0]))}
        >
          {i18n("Copiar estilo")}
        </button>
        <button
          disabled={!style || locked}
          onClick={() => style && patch(style)}
        >
          {i18n("Pegar estilo")}
        </button>
      </div>
    </div>
  );
}
