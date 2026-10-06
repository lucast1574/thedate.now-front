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
          <select
            value={item.photoKey}
            onChange={(e) => onChange({ photoKey: e.target.value })}
          >
            {photos.map((key, n) => (
              <option key={key} value={key}>
                Imagen {n + 1}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <>
          {item.type === "icon" && (
            <label>
              Símbolo
              <select
                value={item.icon}
                onChange={(e) => onChange({ icon: e.target.value })}
              >
                {Object.entries(sectionIcons)
                  .filter(([key]) => key !== "none")
                  .map(([key, symbol]) => (
                    <option key={key} value={key}>
                      {symbol} {key}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <label>
            Color
            <input
              type="color"
              value={item.color}
              onChange={(e) => onChange({ color: e.target.value })}
            />
          </label>
          <label>
            Tipografía
            <select
              value={item.font}
              onChange={(e) =>
                onChange({ font: e.target.value as FlyerElement["font"] })
              }
            >
              <option value="serif">Elegante · Serif</option>
              <option value="sans">Moderna · Sans</option>
              <option value="script">Manuscrita</option>
              <option value="mono">Monoespaciada</option>
            </select>
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
            <select
              aria-label="Alineación del texto"
              value={item.align}
              onChange={(e) =>
                onChange({ align: e.target.value as FlyerElement["align"] })
              }
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
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
