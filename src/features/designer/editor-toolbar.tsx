import { useTranslator } from "@/lib/i18n/react";
import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import Link from "next/link";
import type { useInvitationDesign } from "./use-invitation-design";
import { usePublicationFeedback } from "./publication-feedback";
import { invitationTitle } from "@/lib/events/invitation-title";
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
  const i18n = useTranslator();

  const router = useRouter();
  const updated = usePublicationFeedback();
  return (
    <header className="editor-toolbar">
      <div className="editor-heading">
        <Link
          href="/"
          className="editor-back-link"
          aria-label={i18n("Volver al estudio")}
          onClick={async (e) => {
            e.preventDefault();
            if (await editor.save()) router.push("/");
          }}
        >
          <Icon name="chevron" />
          <span>{i18n("Estudio")}</span>
        </Link>
        <h1>
          <input
            aria-label={i18n("Nombre de la invitación")}
            maxLength={120}
            value={editor.draft.title}
            placeholder={i18n("Tu invitación")}
            onBlur={() =>
              editor.setDraft((current) => ({
                ...current,
                title: invitationTitle(
                  current.kind,
                  current.title,
                  current.celebration,
                ),
              }))
            }
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
              if (await editor.save()) router.push("/?new=1");
            }}
          >
            {i18n("Activar mi invitación")} <Icon name="arrow" />
          </button>
        )}
        <button
          type="button"
          disabled={!editor.canUndo || editor.busy}
          onClick={editor.undo}
          aria-label={i18n("Deshacer")}
        >
          <Icon name="undo" />
        </button>
        <button
          type="button"
          disabled={!editor.canRedo || editor.busy}
          onClick={editor.redo}
          aria-label={i18n("Rehacer")}
        >
          <Icon name="redo" />
        </button>
        <button type="button" onClick={onTemplates}>
          <Icon name="layout" /> {i18n("Plantillas")}
        </button>
        <label className="editor-upload">
          <Icon name="image" /> {i18n("Imagen")}{" "}
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
          {preview ? i18n("Volver a editar") : i18n("Vista previa")}
        </button>
        {!editor.draft.isDemo && (!editor.isPublished || canPublish) && (
          <button
            type="button"
            className="editor-save editor-finish"
            disabled={editor.busy}
            onClick={async () => {
              if (editor.isPublished) {
                if (await editor.publish()) {
                  updated(editor.draft.title);
                  router.push("/");
                }
              } else if (await editor.save())
                router.push(
                  `/manager/${encodeURIComponent(editor.draft.id)}?tab=guests`,
                );
            }}
          >
            {editor.busy
              ? editor.isPublished
                ? i18n("Actualizando…")
                : i18n("Guardando…")
              : editor.isPublished
                ? i18n("Actualizar y continuar")
                : i18n("Terminar y continuar")}
            <Icon name="arrow" />
          </button>
        )}
      </div>
    </header>
  );
}
