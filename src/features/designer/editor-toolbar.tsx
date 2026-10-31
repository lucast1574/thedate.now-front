import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import Link from "next/link";
import type { useInvitationDesign } from "./use-invitation-design";
type Editor = ReturnType<typeof useInvitationDesign>;
export default function EditorToolbar({
  finishHref,
  editor,
  preview,
  onPreview,
  onTemplates,
}: {
  finishHref: string;
  editor: Editor;
  preview: boolean;
  onPreview: () => void;
  onTemplates: () => void;
}) {
  const router = useRouter();
  return (
    <header className="editor-toolbar">
      <div className="editor-heading">
        <Link
          href="/"
          className="editor-back-link"
          aria-label="Volver al estudio"
          onClick={(e) => {
            if (
              editor.dirty &&
              !window.confirm("Tienes cambios sin guardar. ¿Salir del editor?")
            )
              e.preventDefault();
          }}
        >
          <Icon name="chevron" />
          <span>Estudio</span>
        </Link>
        <h1>
          <input
            aria-label="Nombre de la invitación"
            maxLength={120}
            value={editor.draft.title}
            placeholder="Tu invitación"
            onChange={(e) =>
              editor.setDraft((current) => ({
                ...current,
                title: e.target.value,
              }))
            }
          />
        </h1>
        <small role="status">
          {editor.busy
            ? "Procesando…"
            : editor.dirty
              ? editor.recovery?.status || "Guardando copia en este navegador…"
              : "Todo guardado"}
        </small>
      </div>
      <div className="editor-toolbar-actions">
        {editor.draft.isDemo && (
          <button
            type="button"
            disabled={editor.busy}
            className="editor-activate"
            onClick={async () => {
              if (await editor.save())
                router.push(
                  `/?new=1&demo=${encodeURIComponent(editor.draft.id)}`,
                );
            }}
          >
            Activar mi invitación <Icon name="arrow" />
          </button>
        )}
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
          className={editor.draft.isDemo ? "editor-save" : undefined}
          disabled={editor.busy}
          onClick={editor.save}
        >
          <Icon name="save" /> Guardar diseño
        </button>
        {!editor.draft.isDemo && (
          <button
            type="button"
            className="editor-save editor-finish"
            disabled={editor.busy}
            onClick={async () => {
              if (await editor.save()) router.push(finishHref);
            }}
          >
            Terminar y continuar <Icon name="arrow" />
          </button>
        )}
      </div>
    </header>
  );
}
