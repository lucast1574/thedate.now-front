import { useCanvasPanel } from "./use-canvas-panel";
import TemplatePanel from "../template-panel";
import MusicPanel from "../music-panel";
import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
import type { useInvitationDesign } from "../use-invitation-design";
import CanvasPages from "./canvas-pages";
import CanvasSectionPanel from "./canvas-section-panel";
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
    addPage: appendPage,
  } = useCanvasWorkspace(editor);
  const tab = tool,
    setTab = onToolChange;
  const panel = useCanvasPanel(tab, selectedId, active?.id || "");
  function addPage() {
    appendPage();
    setTab("pages");
  }
  function selectPage(id: string) {
    setActiveId(id);
    select("");
    if (window.matchMedia("(min-width: 761px)").matches)
      document
        .getElementById(`page-${id}`)
        ?.scrollIntoView({ block: "nearest" });
  }
  return (
    <div className="canvas-workbench">
      <nav className="canvas-rail" aria-label="Herramientas de diseño">
        {[
          ["pages", "layout", "Secciones"],
          ["elements", "sparkle", "Elementos"],
          ["photos", "image", "Imágenes"],
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
      <aside
        ref={panel}
        className="canvas-panel designer-controls"
        data-tool={tab}
      >
        {selected && (
          <button
            className="canvas-panel-back"
            onClick={() => {
              select("");
              setTab("elements");
            }}
          >
            <Icon name="undo" /> Volver a elementos
          </button>
        )}
        <header hidden={!!selected}>
          <span>TU INVITACIÓN</span>
          <h2>
            {{
              elements:
                event.kind === "general" ? "Arma tu invitación" : "Hazla tuya",
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
          <CanvasSectionPanel
            editor={editor}
            active={active}
            index={index}
            canvas={canvas}
            onSelect={selectPage}
            onAdd={addPage}
            onChange={change}
          />
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
        {selected && tab !== "music" && tab !== "templates" && (
          <CanvasProperties
            kind={draft.kind}
            canvas={canvas}
            selected={selected}
            photos={draft.photoKeys}
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
          setTab(element ? "elements" : "pages");
          if (!element) {
            panel.current?.scrollTo({ top: 0 });
            panel.current?.scrollIntoView({ block: "nearest" });
          }
        }}
        zoom={zoom}
        setZoom={setZoom}
        addPage={addPage}
      />
    </div>
  );
}
