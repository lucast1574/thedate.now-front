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
  const { draft, setDraft } = editor;
  const image = draft.opening?.backgroundImage;
  function update(backgroundImage: ImageBackground | undefined) {
    setDraft((d) => ({
      ...d,
      opening: {
        ...(d.opening || defaultOpening(d.kind === "wedding")),
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
      <summary>Imagen de fondo de la apertura</summary>
      {upload.input}
      <p className="editor-hint">
        Añade una foto, flores o una textura propia para recibir a tus
        invitados.
      </p>
      <label>
        Imagen de la apertura
        <Listbox
          aria-label="Imagen de fondo de la apertura"
          value={image?.photoKey || ""}
          onValueChange={(key) =>
            update(
              key
                ? { ...newImageBackground(key), ...image, photoKey: key }
                : undefined,
            )
          }
        >
          <option value="">Solo color</option>
          <option value="template-photo">Pon tu foto aquí</option>
          {draft.photoKeys.map((key, n) => (
            <option key={key} value={key}>
              Imagen {n + 1}
            </option>
          ))}
        </Listbox>
      </label>
      <button disabled={editor.busy} onClick={() => upload.request("opening")}>
        <Icon name="image" />
        Subir fondo de apertura
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
