import { useTranslator } from "@/lib/i18n/react";
import { useState } from "react";
import Icon from "@/components/icon";
import Photo from "@/components/photo";
import Listbox from "@/components/listbox";
import {
  newImageBackground,
  type ImageBackground,
} from "@/lib/events/background";
import { templatePhotoURL } from "@/lib/events/template-photos";
import { sectionCanvas } from "./canvas-model";
import { useImageReplacement } from "./use-image-replacement";
import BackgroundImageFields from "./background-image-fields";
import type { useInvitationDesign } from "../use-invitation-design";
export default function CanvasBackgroundPanel({
  editor,
  index,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
  index: number;
}) {
  const i18n = useTranslator();

  const [scope, setScope] = useState("section");
  const { draft, setDraft } = editor;
  const section = editor.sections[index];
  const canvas = section ? sectionCanvas(section, draft, i18n) : undefined;
  const target = scope === "all" ? "@invitation" : section?.id || "";
  const image =
    scope === "all" ? draft.backgroundImage : canvas?.backgroundImage;
  function apply(id: string, value: ImageBackground | null, inherit = false) {
    setDraft((d) =>
      id === "@invitation"
        ? { ...d, backgroundImage: value }
        : {
            ...d,
            sections: d.sections?.map((s) =>
              s.id !== id
                ? s
                : {
                    ...s,
                    canvas: {
                      ...sectionCanvas(s, d, i18n),
                      backgroundImage: value || undefined,
                      backgroundOverride: !value && !inherit,
                    },
                  },
            ),
          },
    );
  }
  const replacement = useImageReplacement(async (file, id) => {
    const key = await editor.upload(file);
    if (key) apply(id, newImageBackground(key));
  });
  const photoURL = (key: string) =>
    templatePhotoURL(key) ||
    `/api/photos/${draft.id}/${encodeURIComponent(key)}`;
  return (
    <div className="canvas-background-panel">
      {replacement.input}
      <p className="canvas-panel-description">
        {i18n(
          "Usa tus fotos, texturas o ilustraciones como fondo. Los elementos siguen siendo editables encima.",
        )}
      </p>
      <div
        className="canvas-background-scope"
        role="group"
        aria-label={i18n("Alcance del fondo")}
      >
        <button
          aria-pressed={scope === "section"}
          onClick={() => setScope("section")}
        >
          {i18n("Esta sección")}
        </button>
        <button aria-pressed={scope === "all"} onClick={() => setScope("all")}>
          {i18n("Toda la invitación")}
        </button>
      </div>
      <p className="editor-hint">
        {scope === "all"
          ? i18n(
              "Una sola imagen continua de principio a fin. Las secciones con fondo propio conservan su elección.",
            )
          : i18n(
              "Fondo de {v0}. Puedes usar una imagen propia o heredar el fondo común.",
              { v0: section?.heading || `la sección ${index + 1}` },
            )}
      </p>
      {scope === "section" && (
        <p className="editor-hint" role="status">
          {canvas?.backgroundOverride
            ? i18n("Esta sección usa solo color.")
            : image
              ? i18n("Esta sección tiene una imagen propia.")
              : draft.backgroundImage
                ? i18n("Esta sección usa el fondo continuo.")
                : i18n("Esta sección usa su color de fondo.")}
        </p>
      )}
      {image && (
        <div className="canvas-background-preview">
          <Photo
            src={photoURL(image.photoKey)}
            alt={i18n("Imagen de fondo seleccionada")}
            style={{
              objectFit: image.fit,
              objectPosition: image.position,
              opacity: image.opacity,
            }}
          />
        </div>
      )}
      <label>
        {i18n("Imagen de fondo")}{" "}
        <Listbox
          aria-label={i18n("Imagen de fondo")}
          value={image?.photoKey || ""}
          onValueChange={(key) => {
            if (key)
              apply(target, {
                ...newImageBackground(key),
                ...image,
                photoKey: key,
              });
          }}
        >
          <option value="" disabled>
            {i18n("Elige una imagen")}
          </option>
          <option value="template-photo">{i18n("Pon tu foto aquí")}</option>
          {draft.photoKeys.map((key, n) => (
            <option key={key} value={key}>
              {i18n("Imagen")} {n + 1}
            </option>
          ))}
        </Listbox>
      </label>
      <button
        className="canvas-background-image-button"
        disabled={editor.busy || !target}
        onClick={() => replacement.request(target)}
      >
        <Icon name="image" />
        {i18n("Subir imagen de fondo")}
      </button>
      {image && (
        <BackgroundImageFields
          value={image}
          onChange={(patch) => apply(target, { ...image, ...patch })}
        />
      )}
      <div className="canvas-background-actions">
        {scope === "section" && (
          <button onClick={() => apply(target, null, true)}>
            {i18n("Usar fondo común")}
          </button>
        )}
        <button onClick={() => apply(target, null)}>
          {scope === "all"
            ? i18n("Quitar fondo continuo")
            : i18n("Usar solo color en esta sección")}
        </button>
      </div>
      <p className="editor-hint">
        {i18n(
          "Revisa el fondo en Vista previa y guarda el diseño para aplicar los cambios.",
        )}
      </p>
    </div>
  );
}
