import { selectionIds } from "./composition";
import { invitationTheme } from "../invitation-theme";
import { useCanvasShortcuts } from "./use-canvas-shortcuts";
import { protectedGuestText } from "@/lib/events/guest-name";
import { useState } from "react";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import type { useInvitationDesign } from "../use-invitation-design";
import { blankCanvas, clamp, sectionCanvas } from "./canvas-model";
export function useCanvasWorkspace(
  editor: ReturnType<typeof useInvitationDesign>,
) {
  const { draft, sections } = editor;
  const [activeId, setActiveId] = useState(sections[0]?.id || "");
  const [selection, setSelection] = useState<string[]>([]);
  const selectedIds = selectionIds(canvasForSelection(), selection);
  const selectedId = selectedIds[0] || "";
  function canvasForSelection() {
    const section = sections.find((s) => s.id === activeId) || sections[0];
    return section
      ? sectionCanvas(section, draft)
      : blankCanvas(draft.accentColor, draft.kind);
  }
  function select(id: string, multiple = false) {
    if (!id) {
      setSelection([]);
      return;
    }
    const group = selectionIds(canvasForSelection(), [id]);
    setSelection((current) =>
      multiple
        ? group.every((key) => current.includes(key))
          ? current.filter((key) => !group.includes(key))
          : [...new Set([...current, ...group])]
        : group,
    );
  }
  const [zoom, setZoom] = useState(70);
  const index = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );
  const active = sections[index];
  const canvas = active
    ? sectionCanvas(active, draft)
    : blankCanvas(draft.accentColor, draft.kind);
  const selected = canvas.elements.find((el) => el.id === selectedId);
  function change(next: FlyerCanvas) {
    if (active) editor.updateSection(index, { canvas: next });
  }
  function add(item: FlyerElement, inherit = true) {
    if (!active || canvas.elements.length >= 60) return;
    item = {
      ...item,
      ...(item.type === "image" && inherit
        ? {
            photoTreatment:
              canvas.art === "botanical"
                ? ("soft" as const)
                : ("fade" as const),
            photoFit: "cover" as const,
          }
        : {}),
      font: inherit ? invitationTheme(draft).font : item.font,
      color: inherit ? invitationTheme(draft).ink : item.color,
      width: Math.min(item.width, canvas.width),
      height: Math.min(item.height, canvas.height),
    };
    item.x = clamp(item.x, 0, canvas.width - item.width);
    item.y = clamp(item.y, 0, canvas.height - item.height);
    change({ ...canvas, elements: [...canvas.elements, item] });
    select(item.id);
  }
  function patch(patch: Partial<FlyerElement>) {
    change({
      ...canvas,
      elements: canvas.elements.map((item) => {
        if (item.id !== selectedId || item.locked) return item;
        const next = { ...item, ...patch };
        if (next.binding === "guest_name")
          next.text = protectedGuestText(next.text || "");
        next.width = clamp(next.width, 16, canvas.width);
        next.height = clamp(next.height, 16, canvas.height);
        next.x = clamp(next.x, 0, canvas.width - next.width);
        next.y = clamp(next.y, 0, canvas.height - next.height);
        next.rotation = clamp(next.rotation, -180, 180);
        return next;
      }),
    });
  }
  function layer(direction: number) {
    moveLayer(selectedId, direction);
  }
  function moveLayer(id: string, direction: number) {
    const elements = [...canvas.elements];
    const i = elements.findIndex((el) => el.id === id);
    const n = i + direction;
    if (i < 0 || n < 0 || n >= elements.length) return;
    [elements[i], elements[n]] = [elements[n], elements[i]];
    change({ ...canvas, elements });
    select(id);
  }
  function addPage() {
    if (sections.length >= 20) return;
    const id = crypto.randomUUID();
    editor.setDraft((current) => ({
      ...current,
      designMode: "flyer",
      sections: [
        ...(current.sections || []),
        {
          id,
          icon: "none",
          heading: `Sección ${sections.length + 1}`,
          body: "",
          canvas: blankCanvas(current.accentColor, current.kind),
        },
      ],
    }));
    setActiveId(id);
    select("");
  }
  function selectPage(id: string) {
    setActiveId(id);
    select("");
    if (window.matchMedia("(min-width: 761px)").matches)
      document
        .getElementById(`page-${id}`)
        ?.scrollIntoView({ block: "nearest" });
  }
  useCanvasShortcuts(canvas, selectedId, change, select, selectedIds);
  return {
    draft,
    sections,
    active,
    selected,
    canvas,
    index,
    selectedId,
    selectedIds,
    selectPage,
    select,
    zoom,
    setZoom,
    setActiveId,
    change,
    add,
    patch,
    layer,
    moveLayer,
    addPage,
  };
}
