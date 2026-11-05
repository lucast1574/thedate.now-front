"use client";
import { useMemo, useState } from "react";
import type { Event, User } from "@/lib/events/types";
import PreviewModal from "./preview-modal";
import EditorToolbar from "./editor-toolbar";
import { initialCanvasTool } from "./flyer/canvas-tools";
import CanvasWorkspace from "./flyer/canvas-workspace";
import { blankCanvas, flyerSections } from "./flyer/canvas-model";
import { useInvitationDesign } from "./use-invitation-design";
export default function InvitationDesigner({
  user,
  event,
  onSaved,
  canPublish = true,
}: {
  user?: User;
  canPublish?: boolean;
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
              canvas: blankCanvas(event.accentColor, event.kind),
            },
          ],
    }),
    [event],
  );
  const editor = useInvitationDesign(event, onSaved, source);
  const [preview, setPreview] = useState(false);
  const [tool, setTool] = useState<string>(initialCanvasTool);
  return (
    <main
      className={`editor-shell canvas-studio ${event.kind === "wedding" ? "editor-wedding" : "editor-general"}`}
    >
      <EditorToolbar
        user={user}
        canPublish={canPublish}
        editor={editor}
        preview={preview}
        onPreview={() => setPreview(!preview)}
        onTemplates={() => setTool("templates")}
      />
      {editor.message && (
        <p role="status" className="editor-feedback">
          {editor.message}
        </p>
      )}
      <CanvasWorkspace
        editor={editor}
        event={source}
        tool={tool}
        onToolChange={setTool}
      />
      {preview && (
        <PreviewModal
          draft={editor.draft as Event}
          onClose={() => setPreview(false)}
        />
      )}
    </main>
  );
}
