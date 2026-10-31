import { useImageReplacement } from "./use-image-replacement";
import ElementInspector from "./element-inspector";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
export default function CanvasProperties({
  kind,
  canvas,
  selected,
  photos,
  patch,
  layer,
  add,
  remove,
  replaceImage,
  photoURL,
}: {
  kind?: "wedding" | "general";
  canvas: FlyerCanvas;
  selected?: FlyerElement;
  photos: string[];
  patch: (patch: Partial<FlyerElement>) => void;
  layer: (direction: number) => void;
  add: (element: FlyerElement, inherit?: boolean) => void;
  remove: () => void;
  replaceImage: (file: File, id: string) => Promise<void>;
  photoURL: (key: string) => string;
}) {
  const replacement = useImageReplacement(replaceImage);
  if (!selected) return null;
  return (
    <>
      {replacement.input}
      <ElementInspector
        onReplaceImage={() => replacement.request(selected.id)}
        photoURL={photoURL}
        item={selected}
        canvas={canvas}
        kind={kind}
        photos={photos}
        onChange={patch}
        onLayer={layer}
        onDuplicate={() =>
          add(
            {
              ...selected,
              id: crypto.randomUUID(),
              groupId: undefined,
              locked: false,
              x: Math.min(selected.x + 16, canvas.width - selected.width),
              y: Math.min(selected.y + 16, canvas.height - selected.height),
            },
            false,
          )
        }
        onRemove={remove}
      />
    </>
  );
}
