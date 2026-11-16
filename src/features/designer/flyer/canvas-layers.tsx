import { useTranslator } from "@/lib/i18n/react";
import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { useState } from "react";
import Icon from "@/components/icon";
import { elementLabel } from "@/lib/events/element-label";
import type { FlyerElement } from "@/lib/events/flyer";
function layerLabel(item: FlyerElement, i18n: Translator = spanishTranslator) {
  return (
    ((item.binding || item.icon?.startsWith("art:")) &&
      elementLabel(item, i18n)) ||
    (item.type === "text"
      ? item.text?.slice(0, 45) || i18n("Texto")
      : item.type === "image"
        ? i18n("Imagen")
        : i18n("Símbolo"))
  );
}
export default function CanvasLayers({
  elements,
  selectedId,
  selectedIds = [selectedId],
  onSelect,
  onMove,
  onEdit,
  onElements,
}: {
  elements: FlyerElement[];
  selectedId: string;
  selectedIds?: string[];
  onSelect: (id: string, multiple?: boolean) => void;
  onMove?: (id: string, direction: number) => void;
  onEdit?: (id: string) => void;
  onElements?: () => void;
}) {
  const i18n = useTranslator();

  const [multiple, setMultiple] = useState(false);
  if (!elements.length)
    return (
      <div className="canvas-layers-empty">
        <Icon name="lucide:layers" />
        <h3>{i18n("Aún no hay elementos")}</h3>
        <p>
          {i18n(
            "Añade un texto, una foto o un elemento para ordenar aquí lo que se ve delante y detrás.",
          )}
        </p>
        {onElements && (
          <button onClick={onElements}>{i18n("Añadir elementos")}</button>
        )}
      </div>
    );
  return (
    <section
      className="canvas-layers-panel"
      aria-label={i18n("Orden de los elementos")}
    >
      <p className="canvas-panel-description">
        {i18n(
          "Los primeros se ven delante. Selecciona un elemento para localizarlo o cambia su posición con las flechas.",
        )}
      </p>
      <button aria-pressed={multiple} onClick={() => setMultiple(!multiple)}>
        {i18n("Seleccionar varios")}
      </button>
      <div className="canvas-layers-list">
        {[...elements].reverse().map((item, displayIndex) => {
          const label = layerLabel(item, i18n);
          return (
            <div
              key={item.id}
              className="canvas-layer-row"
              data-selected={selectedIds.includes(item.id) || undefined}
            >
              <button
                className="canvas-layer-select"
                aria-pressed={selectedIds.includes(item.id)}
                onClick={(e) => onSelect(item.id, multiple || e.shiftKey)}
              >
                <Icon
                  name={
                    item.binding === "location"
                      ? "lucide:map-pin"
                      : item.binding === "gift_link"
                        ? "lucide:gift"
                        : item.type === "image"
                          ? "image"
                          : item.type === "icon"
                            ? item.icon || "sparkle"
                            : "lucide:type"
                  }
                />
                <span>
                  {item.locked && <Icon name="lock" />}
                  {label}
                  <small>
                    {displayIndex === 0
                      ? i18n("Delante")
                      : displayIndex === elements.length - 1
                        ? i18n("Detrás")
                        : `Capa ${elements.length - displayIndex}`}
                  </small>
                </span>
              </button>
              <div className="canvas-layer-actions">
                {onMove && (
                  <>
                    <button
                      aria-label={`Adelantar ${label}`}
                      title={i18n("Adelantar una capa")}
                      disabled={displayIndex === 0}
                      onClick={() => onMove(item.id, 1)}
                    >
                      <Icon name="lucide:arrow-up" />
                    </button>
                    <button
                      aria-label={i18n("Enviar atrás {v0}", { v0: label })}
                      title={i18n("Enviar una capa atrás")}
                      disabled={displayIndex === elements.length - 1}
                      onClick={() => onMove(item.id, -1)}
                    >
                      <Icon name="lucide:arrow-down" />
                    </button>
                  </>
                )}
                {onEdit && (
                  <button
                    aria-label={i18n("Editar {v0}", { v0: label })}
                    title={i18n("Editar elemento")}
                    onClick={() => onEdit(item.id)}
                  >
                    <Icon name="lucide:pencil" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
