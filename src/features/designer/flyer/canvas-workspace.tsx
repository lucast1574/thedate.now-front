import TemplatePanel from "../template-panel";
import MusicPanel from "../music-panel";
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
  tool,
  onToolChange,
}: {
  editor: Editor;
  event: Event;
  tool: string;
  onToolChange: (tool: string) => void;
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
    zoom,
    setZoom,
    setActiveId,
    change,
    add,
    patch,
    layer,
    addPage,
  } = useCanvasWorkspace(editor);
  const tab = tool,
    setTab = onToolChange;
  return (
    <div className="canvas-workbench">
      <nav className="canvas-rail" aria-label="Herramientas de diseño">
        {[
          ["elements", "sparkle", "Elementos"],
          ["photos", "image", "Imágenes"],
          ["pages", "layout", "Secciones"],
          ["layers", "table", "Capas"],
          ["music", "music", "Música"],
          ["templates", "layout", "Plantillas"],
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
        <span className="canvas-rail-brand">
          {event.kind === "wedding" ? "Save the Date" : "the date."}
        </span>
      </nav>
      <aside className="canvas-panel designer-controls" data-tool={tab}>
        {selected && (
          <button
            onClick={() => {
              select("");
              setTab("elements");
            }}
          >
            <Icon name="undo" /> Volver a elementos
          </button>
        )}
        <header>
          <span>TU INVITACIÓN</span>
          <h2>
            {{
              elements: "Hazla tuya",
              photos: "Tus imágenes",
              pages: "Secciones",
              music: "Ponle música",
              layers: "Capas del lienzo",
              templates: "Elige tu diseño",
            }[tab] || "Tu invitación"}
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
        {tab === "music" && <MusicPanel editor={editor} />}
        {tab === "templates" && (
          <TemplatePanel
            editor={editor}
            sectionId={active?.id || ""}
            onActivate={(id) => {
              setActiveId(id);
              select("");
              requestAnimationFrame(() =>
                document
                  .getElementById(`page-${id}`)
                  ?.scrollIntoView({ block: "start" }),
              );
            }}
          />
        )}
        {tab !== "music" && tab !== "templates" && (
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
        )}
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
          if (element) setTab("elements");
        }}
        zoom={zoom}
        setZoom={setZoom}
        addPage={addPage}
      />
    </div>
  );
}
