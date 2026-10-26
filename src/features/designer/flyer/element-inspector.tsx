import Icon from "@/components/icon";
import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import GuestBindingField from "./guest-binding-field";
import LocationInspector from "./location-inspector";
import ElementGeometryFields from "./element-geometry-fields";
import TextStyleFields from "./text-style-fields";
import SymbolLibrary from "./symbol-library";
export default function ElementInspector({
  item,
  photos,
  canvas,
  kind,
  onChange,
  onDuplicate,
  onRemove,
}: {
  item: FlyerElement;
  photos: string[];
  canvas?: FlyerCanvas;
  kind?: "wedding" | "general";
  onChange: (patch: Partial<FlyerElement>) => void;
  onDuplicate?: () => void;
  onRemove: () => void;
  onLayer?: (direction: number) => void;
}) {
  const title =
    item.binding === "guest_name"
      ? "Nombre del invitado"
      : item.binding === "location"
        ? "Ubicación"
        : item.type === "image"
          ? "Imagen"
          : item.type === "icon"
            ? "Símbolo"
            : "Texto";
  return (
    <section className="element-inspector">
      <header className="inspector-heading">
        <div>
          <h3>{title}</h3>
          <p>
            {item.binding === "guest_name"
              ? "Personalizado para cada invitado"
              : item.binding === "location"
                ? "Un acceso al lugar de tu celebración"
                : item.type === "image"
                  ? "Tu imagen, completa y sin recortes"
                  : item.type === "icon"
                    ? "Un detalle para tu invitación"
                    : "Dale voz a tu invitación"}
          </p>
        </div>
        <div className="inspector-quick-actions">
          {onDuplicate && (
            <button
              title="Duplicar elemento"
              aria-label="Duplicar elemento"
              onClick={onDuplicate}
            >
              <Icon name="lucide:copy" />
            </button>
          )}
          <button
            title="Eliminar elemento"
            aria-label="Eliminar elemento"
            onClick={onRemove}
          >
            <Icon name="lucide:trash" />
          </button>
        </div>
      </header>
      {item.binding === "guest_name" ? (
        <GuestBindingField
          text={item.text || ""}
          onChange={(text) => onChange({ text })}
        />
      ) : item.binding === "location" ? (
        <LocationInspector key={item.id} item={item} onChange={onChange} />
      ) : (
        item.type === "text" && (
          <label>
            Contenido
            <textarea
              rows={3}
              maxLength={2000}
              value={item.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
            />
          </label>
        )
      )}
      {item.type === "image" ? (
        <>
          <label>
            Reemplazar imagen
            <Listbox
              value={item.photoKey}
              onValueChange={(photoKey) => onChange({ photoKey })}
            >
              {photos.map((key, n) => (
                <option key={key} value={key}>
                  Imagen {n + 1}
                </option>
              ))}
            </Listbox>
          </label>
        </>
      ) : (
        <>
          {item.type === "icon" && (
            <details className="symbol-replace">
              <summary>Cambiar símbolo</summary>
              <SymbolLibrary
                kind={kind}
                onPick={(icon) => onChange({ icon })}
              />
            </details>
          )}
          <details
            className="inspector-disclosure"
            open={item.binding !== "location" || undefined}
            key={`style-${item.id}`}
          >
            <summary>
              <Icon name="lucide:palette" />
              <span>Estilo</span>
              <Icon name="chevron" />
            </summary>
            <div className="inspector-disclosure-body">
              <div className="color-field">
                <span>Color</span>
                <ColorPicker
                  value={item.color}
                  onChange={(color) => onChange({ color })}
                />
              </div>
              {item.type === "text" && item.locationStyle !== "icon" && (
                <TextStyleFields item={item} onChange={onChange} />
              )}
            </div>
          </details>
        </>
      )}
      <ElementGeometryFields item={item} canvas={canvas} onChange={onChange} />
    </section>
  );
}
