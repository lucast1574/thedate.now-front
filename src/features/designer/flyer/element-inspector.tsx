import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
import { sectionIcons } from "@/lib/events/section-icons";
export default function ElementInspector({
  item,
  photos,
  onChange,
  onDuplicate,
  onRemove,
  onLayer,
}: {
  item: FlyerElement;
  photos: string[];
  onChange: (patch: Partial<FlyerElement>) => void;
  onDuplicate?: () => void;
  onRemove: () => void;
  onLayer?: (direction: number) => void;
}) {
  return (
    <section className="element-inspector">
      <h3>
        {item.type === "text"
          ? "Texto"
          : item.type === "image"
            ? "Imagen"
            : "Icono"}{" "}
        seleccionado
      </h3>
      {item.type === "text" && (
        <label>
          {item.binding === "guest_name"
            ? "Texto con nombre del invitado"
            : "Contenido"}
          <textarea
            rows={3}
            maxLength={2000}
            value={item.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
          />
        </label>
      )}
      {item.type === "image" ? (
        <label>
          Imagen
          <Listbox
            value={item.photoKey}
            onValueChange={(value) => onChange({ photoKey: value })}
          >
            {photos.map((key, n) => (
              <option key={key} value={key}>
                Imagen {n + 1}
              </option>
            ))}
          </Listbox>
        </label>
      ) : (
        <>
          {item.type === "icon" && (
            <label>
              Símbolo
              <Listbox
                value={item.icon}
                onValueChange={(value) => onChange({ icon: value })}
              >
                {Object.entries(sectionIcons)
                  .filter(([key]) => key !== "none")
                  .map(([key, symbol]) => (
                    <option key={key} value={key}>
                      {symbol} {key}
                    </option>
                  ))}
              </Listbox>
            </label>
          )}
          <div className="color-field">
            <span>Color</span>
            <ColorPicker
              value={item.color}
              onChange={(color) => onChange({ color })}
            />
          </div>
          <label>
            Tipografía
            <Listbox
              value={item.font}
              onValueChange={(value) =>
                onChange({ font: value as FlyerElement["font"] })
              }
            >
              <option value="serif">Elegante · Serif</option>
              <option value="sans">Moderna · Sans</option>
              <option value="script">Manuscrita</option>
              <option value="mono">Monoespaciada</option>
            </Listbox>
          </label>
          <label>
            Tamaño del texto
            <input
              type="number"
              min={8}
              max={160}
              value={item.fontSize}
              onChange={(e) =>
                onChange({
                  fontSize: Math.max(8, Math.min(160, Number(e.target.value))),
                })
              }
            />
          </label>
          <div className="editor-button-row">
            <button
              type="button"
              aria-pressed={item.bold}
              onClick={() => onChange({ bold: !item.bold })}
            >
              Negrita
            </button>
            <Listbox
              aria-label="Alineación del texto"
              value={item.align}
              onValueChange={(value) =>
                onChange({ align: value as FlyerElement["align"] })
              }
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </Listbox>
          </div>
        </>
      )}
      <div className="inspector-grid">
        {(
          [
            ["x", "Posición X"],
            ["y", "Posición Y"],
            ["width", "Ancho"],
            ["height", "Alto"],
            ["rotation", "Rotación °"],
          ] as const
        ).map(([field, label]) => (
          <label key={field}>
            {label}
            <input
              type="number"
              value={Math.round(item[field])}
              min={
                field === "rotation"
                  ? -180
                  : field === "width" || field === "height"
                    ? 16
                    : 0
              }
              max={field === "rotation" ? 180 : undefined}
              onChange={(e) => onChange({ [field]: Number(e.target.value) })}
            />
          </label>
        ))}
      </div>
      <div className="editor-button-row">
        <button type="button" disabled={!onLayer} onClick={() => onLayer?.(-1)}>
          Enviar atrás
        </button>
        <button type="button" disabled={!onLayer} onClick={() => onLayer?.(1)}>
          Traer delante
        </button>
      </div>
      <div className="editor-button-row">
        <button type="button" disabled={!onDuplicate} onClick={onDuplicate}>
          Duplicar
        </button>
        <button type="button" onClick={onRemove}>
          Eliminar elemento
        </button>
      </div>
    </section>
  );
}
