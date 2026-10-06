import { useState } from "react";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import Photo from "@/components/photo";
import CanvasEditor from "./canvas-editor";
import ElementInspector from "./element-inspector";
import { canvasFormat, clamp, element, sectionCanvas } from "./canvas-model";
export default function FlyerWorkspace({
  draft,
  section,
  onUpdate,
}: {
  draft: DesignEvent;
  section: DesignSection;
  onUpdate: (patch: Partial<DesignSection>) => void;
}) {
  const [selectedId, setSelectedId] = useState("");
  const canvas = sectionCanvas(section, draft);
  const selected = canvas.elements.find((item) => item.id === selectedId);
  const photoURL = (key: string) =>
    `/api/photos/${draft.id}/${encodeURIComponent(key)}`;
  function change(next: FlyerCanvas) {
    onUpdate({ canvas: next });
  }
  function patchElement(patch: Partial<FlyerElement>) {
    change({
      ...canvas,
      elements: canvas.elements.map((item) => {
        if (item.id !== selectedId) return item;
        const next = { ...item, ...patch };
        next.width = clamp(next.width, 16, canvas.width);
        next.height = clamp(next.height, 16, canvas.height);
        next.x = clamp(next.x, 0, canvas.width - next.width);
        next.y = clamp(next.y, 0, canvas.height - next.height);
        next.rotation = clamp(next.rotation, -180, 180);
        return next;
      }),
    });
  }
  function add(type: FlyerElement["type"], photoKey?: string) {
    if (canvas.elements.length >= 60) return;
    const item = element(type, {
      ...(photoKey ? { photoKey } : {}),
      width: Math.min(type === "text" ? 560 : 160, canvas.width),
      height: Math.min(type === "text" ? 120 : 160, canvas.height),
      x: 0,
      y: 0,
      color: draft.accentColor,
    });
    change({ ...canvas, elements: [...canvas.elements, item] });
    setSelectedId(item.id);
  }
  function duplicate() {
    if (!selected || canvas.elements.length >= 60) return;
    const copy = {
      ...selected,
      id: crypto.randomUUID(),
      x: Math.min(selected.x + 20, canvas.width - selected.width),
      y: Math.min(selected.y + 20, canvas.height - selected.height),
    };
    change({ ...canvas, elements: [...canvas.elements, copy] });
    setSelectedId(copy.id);
  }
  function layer(direction: number) {
    const list = [...canvas.elements];
    const index = list.findIndex((item) => item.id === selectedId);
    const next = index + direction;
    if (next < 0 || next >= list.length) return;
    [list[index], list[next]] = [list[next], list[index]];
    change({ ...canvas, elements: list });
  }
  return (
    <div className="flyer-workspace">
      <aside className="flyer-tools designer-controls">
        <h3>Tu lienzo</h3>
        <p className="editor-hint">
          Arrastra un elemento. Usa sus controles para rotar y ampliar, o las
          flechas del teclado para ajustar.
        </p>
        <div className="editor-button-row">
          <button
            type="button"
            disabled={canvas.elements.length >= 60}
            onClick={() => add("text")}
          >
            ＋ Texto
          </button>
          <button
            type="button"
            disabled={canvas.elements.length >= 60}
            onClick={() => add("icon")}
          >
            ＋ Icono
          </button>
        </div>
        <label>
          Fondo
          <input
            type="color"
            value={canvas.background}
            onChange={(e) => change({ ...canvas, background: e.target.value })}
          />
        </label>
        <label>
          Formato
          <select
            value={`${canvas.width}x${canvas.height}`}
            onChange={(e) => {
              const [width, height] = e.target.value.split("x").map(Number);
              change(canvasFormat(canvas, width, height));
            }}
          >
            <option value="720x960">Vertical · 3:4</option>
            <option value="720x720">Cuadrado · 1:1</option>
            <option value="720x1200">Historia · 3:5</option>
          </select>
        </label>
        <h3>Imágenes</h3>
        <div className="editor-photo-grid">
          {draft.photoKeys.map((key, n) => (
            <button
              type="button"
              key={key}
              disabled={canvas.elements.length >= 60}
              aria-label={`Añadir imagen ${n + 1} al lienzo`}
              onClick={() => add("image", key)}
            >
              <Photo src={photoURL(key)} alt={`Imagen ${n + 1}`} />
            </button>
          ))}
        </div>
        {!draft.photoKeys.length && (
          <p className="editor-hint">
            Sube una imagen con el botón de la barra superior.
          </p>
        )}
        {selected && (
          <ElementInspector
            item={selected}
            photos={draft.photoKeys}
            onChange={patchElement}
            onDuplicate={duplicate}
            onRemove={() => {
              change({
                ...canvas,
                elements: canvas.elements.filter(
                  (item) => item.id !== selectedId,
                ),
              });
              setSelectedId("");
            }}
            onLayer={layer}
          />
        )}
        <h3>Capas · {canvas.elements.length}/60</h3>
        <div className="editor-layers">
          {[...canvas.elements].reverse().map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={item.id === selectedId}
              onClick={() => setSelectedId(item.id)}
            >
              {item.type === "text"
                ? item.text?.slice(0, 30) || "Texto"
                : item.type === "image"
                  ? "Imagen"
                  : "Icono"}
            </button>
          ))}
        </div>
      </aside>
      <div className="canvas-stage">
        <CanvasEditor
          canvas={canvas}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={change}
          photoURL={photoURL}
        />
      </div>
    </div>
  );
}
