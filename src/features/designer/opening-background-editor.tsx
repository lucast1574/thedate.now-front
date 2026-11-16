import { useTranslator } from "@/lib/i18n/react";
import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import {
  newImageBackground,
  type ImageBackground,
} from "@/lib/events/background";
import { defaultOpening } from "@/lib/events/celebration";
import BackgroundImageFields from "./flyer/background-image-fields";
import { useImageReplacement } from "./flyer/use-image-replacement";
import type { useInvitationDesign } from "./use-invitation-design";
export default function OpeningBackgroundEditor({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const i18n = useTranslator();

  const { draft, setDraft } = editor;
  const image = draft.opening?.backgroundImage;
  function update(backgroundImage: ImageBackground | undefined) {
    setDraft((d) => ({
      ...d,
      opening: {
        ...(d.opening ||
          defaultOpening(d.kind === "wedding", undefined, undefined, i18n)),
        backgroundImage,
      },
    }));
  }
  const upload = useImageReplacement(async (file) => {
    const key = await editor.upload(file);
    if (key) update(newImageBackground(key));
  });
  return (
    <details className="opening-background-editor">
      <summary>{i18n("Imagen de fondo de la apertura")}</summary>
      {upload.input}
      <p className="editor-hint">
        {i18n(
          "Añade una foto, flores o una textura propia para recibir a tus invitados.",
        )}
      </p>
      <label>
        {i18n("Imagen de la apertura")}{" "}
        <Listbox
          aria-label={i18n("Imagen de fondo de la apertura")}
          value={image?.photoKey || ""}
          onValueChange={(key) =>
            update(
              key
                ? { ...newImageBackground(key), ...image, photoKey: key }
                : undefined,
            )
          }
        >
          <option value="">{i18n("Solo color")}</option>
          <option value="template-photo">{i18n("Pon tu foto aquí")}</option>
          {draft.photoKeys.map((key, n) => (
            <option key={key} value={key}>
              {i18n("Imagen")} {n + 1}
            </option>
          ))}
        </Listbox>
      </label>
      <button disabled={editor.busy} onClick={() => upload.request("opening")}>
        <Icon name="image" />
        {i18n("Subir fondo de apertura")}
      </button>
      {image && (
        <BackgroundImageFields
          value={image}
          onChange={(patch) => update({ ...image, ...patch })}
        />
      )}
    </details>
  );
}
