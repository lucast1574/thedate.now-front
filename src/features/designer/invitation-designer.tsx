"use client";
import { useEffect, useState } from "react";
import type { Event } from "@/lib/events/types";
import type { DesignMode } from "@/lib/events/flyer";
import PreviewModal from "./preview-modal";
import EditorToolbar from "./editor-toolbar";
import SectionWorkspace from "./section-workspace";
import FlyerWorkspace from "./flyer/flyer-workspace";
import TemplateGallery from "./template-gallery";
import { resolveTemplateId } from "@/lib/events/template-catalog";
import ProductHeading from "@/components/product-heading";
import { applyTemplate } from "./templates";
import { flyerSections } from "./flyer/canvas-model";
import { useInvitationDesign } from "./use-invitation-design";
export default function InvitationDesigner({
  event,
  onSaved,
}: {
  event: Event;
  onSaved: () => Promise<void>;
}) {
  const editor = useInvitationDesign(event, onSaved);
  const { draft, setDraft, sections } = editor;
  const [preview, setPreview] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [activeId, setActiveId] = useState(sections[0]?.id || "");
  const index = Math.max(
    0,
    sections.findIndex((item) => item.id === activeId),
  );
  const active = sections[index];
  const mode = draft.designMode || "sections";
  useEffect(() => {
    if (!editor.dirty) return;
    const leave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [editor.dirty]);
  function switchMode(next: DesignMode) {
    setDraft((current) => ({
      ...current,
      designMode: next,
      templateId: resolveTemplateId(current.kind, current.template, next),
      sections: next === "flyer" ? flyerSections(current) : current.sections,
    }));
  }
  return (
    <main
      className={`editor-shell ${draft.kind === "wedding" ? "editor-wedding" : "editor-general"}`}
    >
      <ProductHeading kind={draft.kind} area="editor" />
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
      <nav className="editor-mode-bar" aria-label="Modo de edición">
        <button
          type="button"
          aria-pressed={mode === "sections"}
          onClick={() => switchMode("sections")}
        >
          Por secciones
        </button>
        <button
          type="button"
          aria-pressed={mode === "flyer"}
          onClick={() => switchMode("flyer")}
        >
          Flyer · lienzo libre
        </button>
        <span>
          {draft.kind === "wedding"
            ? "SAVE THE DATE · BODAS"
            : "THE DATE · EVENTOS"}
        </span>
      </nav>
      {mode === "sections" ? (
        <SectionWorkspace editor={editor} />
      ) : (
        <>
          <div className="editor-section-tabs">
            <div>
              {sections.map((section, n) => (
                <button
                  type="button"
                  key={section.id}
                  aria-pressed={section.id === active?.id}
                  onClick={() => setActiveId(section.id)}
                >
                  {n + 1}. {section.heading || "Sección"}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={sections.length >= 20}
              onClick={editor.addSection}
            >
              ＋ Sección
            </button>
          </div>
          {active && (
            <>
              <div className="editor-section-actions">
                <label>
                  Nombre de la sección
                  <input
                    maxLength={120}
                    value={active.heading}
                    onChange={(e) =>
                      editor.updateSection(index, { heading: e.target.value })
                    }
                  />
                </label>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => editor.moveSection(index, -1)}
                >
                  ↑ Subir
                </button>
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => editor.moveSection(index, 1)}
                >
                  ↓ Bajar
                </button>
                <button
                  type="button"
                  onClick={() => editor.removeSection(active.id)}
                >
                  Eliminar sección
                </button>
              </div>
              <FlyerWorkspace
                key={active.id}
                draft={draft}
                section={active}
                onUpdate={(patch) => editor.updateSection(index, patch)}
              />
            </>
          )}
          {!active && (
            <div className="editor-empty">
              <h2>Empieza con un lienzo</h2>
              <button type="button" onClick={editor.addSection}>
                ＋ Añadir sección
              </button>
            </div>
          )}
        </>
      )}
      {preview && (
        <PreviewModal
          draft={draft as Event}
          onClose={() => setPreview(false)}
        />
      )}
      {gallery && (
        <TemplateGallery
          draft={draft}
          onClose={() => setGallery(false)}
          onApply={(template) => {
            setDraft((current) => applyTemplate(current, template));
            setGallery(false);
          }}
        />
      )}
    </main>
  );
}
