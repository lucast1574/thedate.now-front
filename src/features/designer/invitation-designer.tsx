"use client";
import { useEffect, useMemo, useState } from "react";
import type { Event } from "@/lib/events/types";
import PreviewModal from "./preview-modal";
import EditorToolbar from "./editor-toolbar";
import CanvasWorkspace from "./flyer/canvas-workspace";
import TemplateGallery from "./template-gallery";
import { applyTemplate } from "./templates";
import { blankCanvas, flyerSections } from "./flyer/canvas-model";
import { useInvitationDesign } from "./use-invitation-design";
export default function InvitationDesigner({
  event,
  onSaved,
}: {
  event: Event;
  onSaved: () => Promise<void>;
}) {
  const source = useMemo(
    () => ({
      ...event,
      designMode: "flyer" as const,
      sections: event.sections?.length
        ? flyerSections(event)
        : [
            {
              id: `${event.id}-canvas`,
              icon: "none",
              heading: "Sección 1",
              body: "",
              canvas: blankCanvas(event.accentColor),
            },
          ],
    }),
    [event],
  );
  const editor = useInvitationDesign(event, onSaved, source);
  const [preview, setPreview] = useState(false);
  const [gallery, setGallery] = useState(false);
  useEffect(() => {
    if (!editor.dirty) return;
    const leave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [editor.dirty]);
  return (
    <main
      className={`editor-shell canvas-studio ${event.kind === "wedding" ? "editor-wedding" : "editor-general"}`}
    >
      <EditorToolbar
        editor={editor}
        preview={preview}
        onPreview={() => setPreview(!preview)}
        onTemplates={() => setGallery(true)}
      />
      {editor.message && (
        <p role="status" className="editor-feedback">
          {editor.message}
        </p>
      )}
      <CanvasWorkspace
        editor={editor}
        event={source}
        onTemplates={() => setGallery(true)}
      />
      {preview && (
        <PreviewModal
          draft={editor.draft as Event}
          onClose={() => setPreview(false)}
        />
      )}
      {gallery && (
        <TemplateGallery
          draft={editor.draft}
          onClose={() => setGallery(false)}
          onApply={(template) => {
            editor.setDraft((current) => {
              const next = applyTemplate(current, {
                ...template,
                mode: "flyer",
              });
              return {
                ...next,
                designMode: "flyer",
                sections: flyerSections(next),
              };
            });
            setGallery(false);
          }}
        />
      )}
    </main>
  );
}
