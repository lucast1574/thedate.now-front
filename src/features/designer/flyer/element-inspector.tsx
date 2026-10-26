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
  onLayer,
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
      <h3>{title}</h3>
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
          <p className="editor-hint">
            La imagen se muestra completa, sin recortes.
          </p>
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
        </>
      )}
      <ElementGeometryFields item={item} canvas={canvas} onChange={onChange} />
      <div className="editor-button-row">
        <button disabled={!onLayer} onClick={() => onLayer?.(-1)}>
          Enviar atrás
        </button>
        <button disabled={!onLayer} onClick={() => onLayer?.(1)}>
          Traer delante
        </button>
      </div>
      <div className="editor-button-row">
        <button disabled={!onDuplicate} onClick={onDuplicate}>
          Duplicar
        </button>
        <button onClick={onRemove}>Eliminar elemento</button>
      </div>
    </section>
  );
}
