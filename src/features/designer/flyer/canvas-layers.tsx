import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";
function layerLabel(item: FlyerElement) {
  const bindings = {
    guest_name: "Nombre del invitado",
    location: "Ubicación",
    dress_code: "Dress code",
    adults_notice: "Aviso de adultos",
    gift_link: "Lista de regalos",
  };
  return (
    (item.binding && bindings[item.binding]) ||
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
  onSelect,
  onMove,
  onEdit,
  onElements,
}: {
  elements: FlyerElement[];
  selectedId: string;
  onSelect: (id: string) => void;
  onMove?: (id: string, direction: number) => void;
  onEdit?: (id: string) => void;
  onElements?: () => void;
}) {
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
      <div className="canvas-layers-list">
        {[...elements].reverse().map((item, displayIndex) => {
          const label = layerLabel(item);
          return (
            <div
              key={item.id}
              className="canvas-layer-row"
              data-selected={item.id === selectedId || undefined}
            >
              <button
                className="canvas-layer-select"
                aria-pressed={item.id === selectedId}
                onClick={() => onSelect(item.id)}
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
