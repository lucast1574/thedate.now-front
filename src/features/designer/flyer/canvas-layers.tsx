import { useState } from "react";
import Icon from "@/components/icon";
import { elementLabel } from "@/lib/events/element-label";
import type { FlyerElement } from "@/lib/events/flyer";
function layerLabel(item: FlyerElement) {
  return (
    (item.binding && elementLabel(item)) ||
    (item.type === "text"
      ? item.text?.slice(0, 45) || "Texto"
      : item.type === "image"
        ? "Imagen"
        : "Símbolo")
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
  const [multiple, setMultiple] = useState(false);
  if (!elements.length)
    return (
      <div className="canvas-layers-empty">
        <Icon name="lucide:layers" />
        <h3>Aún no hay elementos</h3>
        <p>
          Añade un texto, una foto o un elemento para ordenar aquí lo que se ve
          delante y detrás.
        </p>
        {onElements && <button onClick={onElements}>Añadir elementos</button>}
      </div>
    );
  return (
    <section
      className="canvas-layers-panel"
      aria-label="Orden de los elementos"
    >
      <p className="canvas-panel-description">
        Los primeros se ven delante. Selecciona un elemento para localizarlo o
        cambia su posición con las flechas.
      </p>
      <button aria-pressed={multiple} onClick={() => setMultiple(!multiple)}>
        Seleccionar varios
      </button>
      <div className="canvas-layers-list">
        {[...elements].reverse().map((item, displayIndex) => {
          const label = layerLabel(item);
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
                      ? "Delante"
                      : displayIndex === elements.length - 1
                        ? "Detrás"
                        : `Capa ${elements.length - displayIndex}`}
                  </small>
                </span>
              </button>
              <div className="canvas-layer-actions">
                {onMove && (
                  <>
                    <button
                      aria-label={`Adelantar ${label}`}
                      title="Adelantar una capa"
                      disabled={displayIndex === 0}
                      onClick={() => onMove(item.id, 1)}
                    >
                      <Icon name="lucide:arrow-up" />
                    </button>
                    <button
                      aria-label={`Enviar atrás ${label}`}
                      title="Enviar una capa atrás"
                      disabled={displayIndex === elements.length - 1}
                      onClick={() => onMove(item.id, -1)}
                    >
                      <Icon name="lucide:arrow-down" />
                    </button>
                  </>
                )}
                {onEdit && (
                  <button
                    aria-label={`Editar ${label}`}
                    title="Editar elemento"
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
