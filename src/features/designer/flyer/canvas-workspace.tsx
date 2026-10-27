import { useCanvasPanel } from "./use-canvas-panel";
import CanvasRail from "./canvas-rail";
import CanvasPanelHeading from "./canvas-panel-heading";
import CanvasSettings from "./canvas-settings";
import TemplatePanel from "../template-panel";
import MusicPanel from "../music-panel";
import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
import type { useInvitationDesign } from "../use-invitation-design";
import CanvasPages from "./canvas-pages";
import CanvasSectionControls from "./canvas-section-controls";
import CanvasSectionPanel from "./canvas-section-panel";
import CanvasSelectionInspector from "./canvas-selection-inspector";
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
  const workspace = useCanvasWorkspace(editor);
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
    moveLayer,
    addPage: appendPage,
  } = workspace;
  const tab = tool,
    setTab = onToolChange;
  const panel = useCanvasPanel(
    tab,
    tab === "elements" ? selectedId : "",
    active?.id || "",
  );
  function addPage() {
    appendPage();
    setTab("elements");
  }
  function selectPage(id: string) {
    setActiveId(id);
    select("");
    if (window.matchMedia("(min-width: 761px)").matches)
      document
        .getElementById(`page-${id}`)
        ?.scrollIntoView({ block: "nearest" });
  }
  const inspecting = !!selected && tab === "elements";
  return (
    <div className="canvas-workbench">
      <CanvasRail
        tab={tab}
        kind={event.kind}
        onChange={(id) => {
          setTab(id);
          select("");
        }}
      />
      <aside
        id="canvas-tools"
        ref={panel}
        className="canvas-panel designer-controls"
        data-tool={tab}
      >
        {inspecting && (
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
        {!inspecting &&
          active &&
          ["elements", "background", "photos", "layers"].includes(tab) && (
            <CanvasSectionControls
              key={tab}
              sections={editor.sections}
              activeId={active.id}
              canvas={canvas}
              onSelect={selectPage}
              onAdd={addPage}
              onBackground={
                tab === "background" ? undefined : () => setTab("background")
              }
              onChange={change}
            />
          )}
        <CanvasPanelHeading tool={tab} hidden={inspecting} />
        {!inspecting && (tab === "elements" || tab === "photos") && (
          <CanvasToolbox
            event={event}
            draft={draft}
            canvas={canvas}
            onPhotos={() => setTab("photos")}
            photosOnly={tab === "photos"}
            disabled={!active || canvas.elements.length >= 60}
            onAdd={(item) => {
              add(item);
              setTab("elements");
            }}
            onUpload={editor.upload}
            busy={editor.busy}
          />
        )}
        {tab === "pages" && (
          <CanvasSectionPanel
            editor={editor}
            onAdd={addPage}
            active={active}
            index={index}
            canvas={canvas}
            onOpening={() => {
              select("");
              setTab("opening");
            }}
            onSelect={selectPage}
            onChange={change}
          />
        )}
        {tab === "layers" && (
          <CanvasLayers
            elements={canvas.elements}
            selectedId={selectedId}
            onSelect={select}
            onMove={moveLayer}
            onEdit={(id) => {
              select(id);
              setTab("elements");
            }}
            onElements={() => {
              select("");
              setTab("elements");
            }}
          />
        )}
        {tab === "music" && <MusicPanel editor={editor} />}
        <CanvasSettings tool={tab} editor={editor} index={index} />
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
        {inspecting && (
          <CanvasSelectionInspector editor={editor} workspace={workspace} />
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
          setTab("elements");
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
