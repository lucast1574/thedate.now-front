import FlyerPhotoGrid from "./flyer-photo-grid";
import { useTranslator } from "@/lib/i18n/react";
import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import CanvasLayers from "./canvas-layers";
import { guestNameElement } from "@/lib/events/guest-name";
import { useState } from "react";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
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
  const i18n = useTranslator();

  const [selectedId, setSelectedId] = useState("");
  const canvas = sectionCanvas(section, draft, i18n);
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
    const item = element(
      type,
      {
        ...(photoKey ? { photoKey } : {}),
        width: Math.min(type === "text" ? 560 : 160, canvas.width),
        height: Math.min(type === "text" ? 120 : 160, canvas.height),
        x: 0,
        y: 0,
        color: draft.accentColor,
      },
      i18n,
    );
    change({ ...canvas, elements: [...canvas.elements, item] });
    setSelectedId(item.id);
  }
  function addGuestName() {
    if (canvas.elements.length >= 60) return;
    const item = {
      ...guestNameElement(draft.accentColor, crypto.randomUUID()),
      width: Math.min(560, canvas.width),
      height: Math.min(160, canvas.height),
      y: 0,
    };
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
        <h3>{i18n("Tu lienzo")}</h3>
        <p className="editor-hint">
          {i18n(
            "Arrastra para mover; usa las esquinas para cambiar el tamaño.",
          )}
        </p>
        <div className="editor-button-row">
          <button
            type="button"
            disabled={canvas.elements.length >= 60}
            onClick={() => add("text")}
          >
            {i18n("＋ Texto")}
          </button>
          <button
            type="button"
            disabled={canvas.elements.length >= 60}
            onClick={() => add("icon")}
          >
            {i18n("＋ Icono")}
          </button>
        </div>
        <button
          type="button"
          disabled={canvas.elements.length >= 60}
          onClick={addGuestName}
        >
          {i18n("＋ Nombre del invitado")}
        </button>
        <p className="editor-hint">
          {i18n("El texto")} {"{{nombre_invitado}}"}{" "}
          {i18n("se sustituye automáticamente por el nombre del destinatario.")}
        </p>
        <div className="color-field">
          <span>{i18n("Fondo")}</span>
          <ColorPicker
            label={i18n("Fondo")}
            value={canvas.background}
            onChange={(background) => change({ ...canvas, background })}
          />
        </div>
        <label>
          {i18n("Formato")}{" "}
          <Listbox
            value={`${canvas.width}x${canvas.height}`}
            onValueChange={(value) => {
              const [width, height] = value.split("x").map(Number);
              change(canvasFormat(canvas, width, height));
            }}
          >
            <option value="720x960">{i18n("Vertical · 3:4")}</option>
            <option value="720x720">{i18n("Cuadrado · 1:1")}</option>
            <option value="720x1200">{i18n("Historia · 3:5")}</option>
          </Listbox>
        </label>
        <FlyerPhotoGrid
          draft={draft}
          canvas={canvas}
          photoURL={photoURL}
          add={add}
        />
        {selected && (
          <ElementInspector
            item={selected}
            canvas={canvas}
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
        <div className="editor-layers">
          <CanvasLayers
            elements={canvas.elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </aside>
      <div className="canvas-stage">
        <CanvasEditor
          event={draft}
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
