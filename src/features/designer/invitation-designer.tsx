"use client";
import { useEffect, useMemo, useState } from "react";
import type { Event } from "@/lib/events/types";
import PreviewModal from "./preview-modal";
import EditorToolbar from "./editor-toolbar";
import { initialCanvasTool } from "./flyer/canvas-tools";
import CanvasWorkspace from "./flyer/canvas-workspace";
import { blankCanvas, flyerSections } from "./flyer/canvas-model";
import { useInvitationDesign } from "./use-invitation-design";
export default function InvitationDesigner({
  finishHref,
  event,
  onSaved,
}: {
  finishHref: string;
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
  useEffect(() => {
    if (!editor.dirty) return;
    const leave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [editor.dirty]);
  if (!editor.recovery.ready)
    return (
      <main className="editor-loading" aria-busy="true">
        Preparando tu diseño…
      </main>
    );
  if (editor.recovery.pending)
    return (
      <main className="editor-loading editor-recovery">
        <h1>Recupera tu trabajo</h1>
        <p>Hay una copia de este diseño sin guardar en este navegador.</p>
        <p>
          Recuperarla combina tus cambios locales con los datos actuales. Puedes
          deshacer después de abrir el editor.
        </p>
        <button
          className="recovery-primary"
          type="button"
          onClick={() => editor.recovery.resolve(true)}
        >
          Recuperar mi trabajo
        </button>
        <button type="button" onClick={() => editor.recovery.resolve(false)}>
          Continuar con la versión guardada
        </button>
      </main>
    );
  return (
    <main
      className={`editor-shell canvas-studio ${event.kind === "wedding" ? "editor-wedding" : "editor-general"}`}
    >
      <EditorToolbar
        finishHref={finishHref}
        editor={editor}
        preview={preview}
        onPreview={() => setPreview(!preview)}
        onTemplates={() => setTool("templates")}
      />
      {event.isDemo && (
        <p className="demo-continuity-note">
          <strong>Tu demo sí cuenta.</strong> Lo que diseñes aquí se conservará
          al completar los datos y activar tu invitación.{" "}
          <span>Diseña → Completa tus datos → Paga → Sigue editando</span>
        </p>
      )}
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
