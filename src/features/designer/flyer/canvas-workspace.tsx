import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
import type { useInvitationDesign } from "../use-invitation-design";
import CanvasPages from "./canvas-pages";
import CanvasProperties from "./canvas-properties";
import CanvasToolbox from "./canvas-toolbox";
import CanvasLayers from "./canvas-layers";
import { useCanvasWorkspace } from "./use-canvas-workspace";
type Editor = ReturnType<typeof useInvitationDesign>;
export default function CanvasWorkspace({
  editor,
  event,
  onTemplates,
}: {
  editor: Editor;
  event: Event;
  onTemplates: () => void;
}) {
  const {
    draft,
    sections,
    active,
    selected,
    canvas,
    index,
    selectedId,
    select,
    tab,
    setTab,
    zoom,
    setZoom,
    setActiveId,
    change,
    add,
    patch,
    layer,
    addPage,
  } = useCanvasWorkspace(editor);
  return (
    <div className="canvas-workbench">
      <nav className="canvas-rail" aria-label="Herramientas de diseño">
        {[
          ["elements", "sparkle", "Elementos"],
          ["photos", "image", "Imágenes"],
          ["pages", "layout", "Secciones"],
          ["layers", "table", "Capas"],
        ].map(([id, icon, label]) => (
          <button
            key={id}
            aria-pressed={tab === id}
            onClick={() => {
              setTab(id);
              select("");
            }}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        ))}
        <button onClick={onTemplates}>
          <Icon name="layout" />
          <span>Plantillas</span>
        </button>
        <span className="canvas-rail-brand">
          {event.kind === "wedding" ? "Save the Date" : "the date."}
        </span>
      </nav>
      <aside className="canvas-panel designer-controls">
        {selected && (
          <button onClick={() => select("")}>
            <Icon name="undo" /> Volver a elementos
          </button>
        )}
        <header>
          <span>TU INVITACIÓN</span>
          <h2>
            {tab === "elements"
              ? "Hazla tuya"
              : tab === "photos"
                ? "Tus imágenes"
                : tab === "pages"
                  ? "Secciones"
                  : "Capas del lienzo"}
          </h2>
        </header>
        {!selected && (tab === "elements" || tab === "photos") && (
          <CanvasToolbox
            event={event}
            draft={draft}
            canvas={canvas}
            photosOnly={tab === "photos"}
            disabled={!active || canvas.elements.length >= 60}
            onAdd={add}
            onUpload={editor.upload}
            busy={editor.busy}
          />
        )}
        {tab === "pages" && (
          <div className="canvas-page-list">
            {sections.map((s, n) => (
              <button
                key={s.id}
                aria-pressed={s.id === active?.id}
                onClick={() => {
                  setActiveId(s.id);
                  select("");
                  document
                    .getElementById(`page-${s.id}`)
                    ?.scrollIntoView({ block: "nearest" });
                }}
              >
                <span>{String(n + 1).padStart(2, "0")}</span>
                {s.heading || "Sección sin título"}
              </button>
            ))}
            <button disabled={sections.length >= 20} onClick={addPage}>
              <Icon name="plus" /> Añadir sección
            </button>
          </div>
        )}
        {tab === "layers" && (
          <CanvasLayers
            elements={canvas.elements}
            selectedId={selectedId}
            onSelect={select}
          />
        )}
        <CanvasProperties
          active={active}
          index={index}
          canvas={canvas}
          selected={selected}
          photos={draft.photoKeys}
          update={(patch) => editor.updateSection(index, patch)}
          change={change}
          patch={patch}
          layer={layer}
          add={add}
          remove={() => {
            change({
              ...canvas,
              elements: canvas.elements.filter((el) => el.id !== selectedId),
            });
            select("");
          }}
        />
      </aside>
      <CanvasPages
        selected={selected}
        patch={patch}
        editor={editor}
        activeId={active?.id || ""}
        selectedId={selectedId}
        onSelect={(page, element) => {
          setActiveId(page);
          select(element);
        }}
        zoom={zoom}
        setZoom={setZoom}
        addPage={addPage}
      />
    </div>
  );
}
