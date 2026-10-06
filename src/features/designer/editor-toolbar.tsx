import Icon from "@/components/icon";
import Link from "next/link";
import type { useInvitationDesign } from "./use-invitation-design";
type Editor = ReturnType<typeof useInvitationDesign>;
export default function EditorToolbar({
  editor,
  preview,
  onPreview,
  onTemplates,
}: {
  editor: Editor;
  preview: boolean;
  onPreview: () => void;
  onTemplates: () => void;
}) {
  return (
    <header className="editor-toolbar">
      <div className="editor-heading">
        <Link
          href="/"
          onClick={(e) => {
            if (
              editor.dirty &&
              !window.confirm("Tienes cambios sin guardar. ¿Salir del editor?")
            )
              e.preventDefault();
          }}
        >
          ← Estudio
        </Link>
        <h1>{editor.draft.title || "Tu invitación"}</h1>
        <small role="status">
          {editor.busy
            ? "Procesando…"
            : editor.dirty
              ? "Cambios sin guardar"
              : "Todo guardado"}
        </small>
      </div>
      <div className="editor-toolbar-actions">
        <button
          type="button"
          disabled={!editor.canUndo || editor.busy}
          onClick={editor.undo}
          aria-label="Deshacer"
        >
          <Icon name="undo" />
        </button>
        <button
          type="button"
          disabled={!editor.canRedo || editor.busy}
          onClick={editor.redo}
          aria-label="Rehacer"
        >
          <Icon name="redo" />
        </button>
        <button type="button" onClick={onTemplates}>
          <Icon name="layout" /> Plantillas
        </button>
        <label className="editor-upload">
          <Icon name="image" /> Imagen
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={editor.busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void editor.upload(file);
              e.target.value = "";
            }}
          />
        </label>
        <button type="button" aria-pressed={preview} onClick={onPreview}>
          {preview ? "Volver a editar" : "Vista previa"}
        </button>
        <button
          type="button"
          className="editor-save"
          disabled={editor.busy}
          onClick={editor.save}
        >
          <Icon name="save" /> Guardar diseño
        </button>
      </div>
    </header>
  );
}
