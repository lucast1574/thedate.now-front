import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import Link from "next/link";
import type { useInvitationDesign } from "./use-invitation-design";
type Editor = ReturnType<typeof useInvitationDesign>;
export default function EditorToolbar({
  editor,
  canPublish,
  preview,
  onPreview,
  onTemplates,
}: {
  canPublish: boolean;
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
          onClick={async (e) => {
            e.preventDefault();
            if (await editor.save()) router.push("/");
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
        {!editor.draft.isDemo && (!editor.draft.publishedAt || canPublish) && (
          <button
            type="button"
            className="editor-save editor-finish"
            disabled={editor.busy}
            onClick={async () => {
              if (editor.draft.publishedAt) await editor.publish();
              else if (await editor.save())
                router.push(
                  `/manager/${encodeURIComponent(editor.draft.id)}?tab=guests`,
                );
            }}
          >
            {editor.draft.publishedAt
              ? "Actualizar invitación"
              : "Terminar y continuar"}
            <Icon name="arrow" />
          </button>
        )}
      </div>
    </header>
  );
}
