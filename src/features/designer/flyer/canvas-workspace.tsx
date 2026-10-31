import CompositionTools from "./composition-tools";
import { useCanvasPanel } from "./use-canvas-panel";
import CanvasRail from "./canvas-rail";
import CanvasPanelHeading from "./canvas-panel-heading";
import CanvasSettings from "./canvas-settings";
import TemplateWorkspacePanel from "./template-workspace-panel";
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
    selectPage,
  } = workspace;
  const panel = useCanvasPanel(
    tool,
    tool === "elements" ? selectedId : "",
    active?.id || "",
  );
  function addPage() {
    appendPage();
    onToolChange("elements");
  }
  const inspecting = !!selected && tool === "elements";
  return (
    <div className="canvas-workbench">
      <CanvasRail
        tab={tool}
        kind={event.kind}
        onChange={(id) => {
          onToolChange(id);
          select("");
        }}
      />
      <aside
        id="canvas-tools"
        ref={panel}
        className="canvas-panel designer-controls"
        data-tool={tool}
      >
        {inspecting && (
          <button
            className="canvas-panel-back"
            onClick={() => {
              select("");
              onToolChange("elements");
            }}
          >
            <Icon name="undo" /> Volver a elementos
          </button>
        )}
        {!inspecting &&
          active &&
          ["elements", "background", "photos", "layers"].includes(tool) && (
            <CanvasSectionControls
              key={tool}
              sections={editor.sections}
              activeId={active.id}
              canvas={canvas}
              onSelect={selectPage}
              onAdd={addPage}
              onBackground={
                tool === "background"
                  ? undefined
                  : () => onToolChange("background")
              }
              onChange={change}
            />
          )}
        <CanvasPanelHeading tool={tool} hidden={inspecting} />
        {(inspecting || tool === "layers") && (
          <CompositionTools
            canvas={canvas}
            ids={workspace.selectedIds}
            onChange={change}
          />
        )}
        {!inspecting && (tool === "elements" || tool === "photos") && (
          <CanvasToolbox
            event={event}
            draft={draft}
            canvas={canvas}
            onPhotos={() => onToolChange("photos")}
            photosOnly={tool === "photos"}
            disabled={!active || canvas.elements.length >= 60}
            onAdd={(item) => {
              add(item);
              onToolChange("elements");
            }}
            onUpload={editor.upload}
            busy={editor.busy}
          />
        )}
        {tool === "pages" && (
          <CanvasSectionPanel
            editor={editor}
            onAdd={addPage}
            active={active}
            index={index}
            canvas={canvas}
            onOpening={() => {
              select("");
              onToolChange("opening");
            }}
            onSelect={selectPage}
            onChange={change}
          />
        )}
        {tool === "layers" && (
          <CanvasLayers
            elements={canvas.elements}
            selectedId={selectedId}
            selectedIds={workspace.selectedIds}
            onSelect={select}
            onMove={moveLayer}
            onEdit={(id) => {
              select(id);
              onToolChange("elements");
            }}
            onElements={() => {
              select("");
              onToolChange("elements");
            }}
          />
        )}
        {tool === "music" && <MusicPanel editor={editor} />}
        <CanvasSettings tool={tool} editor={editor} index={index} />
        {tool === "templates" && (
          <TemplateWorkspacePanel
            editor={editor}
            activeId={active?.id || ""}
            setActiveId={setActiveId}
            select={select}
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
        selectedIds={workspace.selectedIds}
        onSelect={(page, element, multiple) => {
          setActiveId(page);
          select(element, multiple);
          onToolChange("elements");
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
