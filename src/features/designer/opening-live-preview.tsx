import { useTranslator } from "@/lib/i18n/react";
import { useRef } from "react";
import type { DesignEvent } from "@/lib/events/types";
import type { Opening } from "@/lib/events/celebration";
import OpeningScene from "@/features/invitations/opening-scene";
import { useOpeningAnimation } from "@/features/invitations/use-opening-animation";
import FlyerSurface from "@/components/flyer-surface";
import Icon from "@/components/icon";
import { sectionBackground } from "@/lib/events/background";
export default function OpeningLivePreview({
  draft,
  opening,
}: {
  draft: DesignEvent;
  opening: Opening;
}) {
  const i18n = useTranslator();

  const node = useRef<HTMLDivElement>(null);
  const animation = useOpeningAnimation(opening.style);
  const photo = (key: string) =>
    `/api/photos/${draft.id}/${encodeURIComponent(key)}`;
  const canvas = draft.sections?.[0]?.canvas;
  return (
    <section
      className="opening-live-preview"
      aria-label={i18n("Vista previa interactiva de apertura")}
    >
      <div className="opening-preview-screen" ref={node}>
        {animation.phase === "done" ? (
          <div className="opening-preview-revealed">
            {canvas ? (
              <FlyerSurface
                canvas={canvas}
                photoURL={photo}
                backgroundSlice={sectionBackground(
                  draft.sections || [],
                  0,
                  draft.backgroundImage,
                )}
              />
            ) : (
              <div>
                <Icon name="check" />
                <h3>{draft.title || i18n("Tu invitación")}</h3>
                <p>{i18n("Aquí comienza tu diseño.")}</p>
              </div>
            )}
          </div>
        ) : (
          <OpeningScene
            opening={opening}
            title={draft.title}
            wedding={draft.kind === "wedding"}
            photoURL={photo}
            phase={animation.phase}
            onOpen={() => animation.open(node.current)}
            preview
          />
        )}
      </div>
      <div className="opening-preview-caption">
        <span role="status">
          {animation.phase === "done"
            ? i18n("Así llegas a tu canvas")
            : animation.phase === "opening"
              ? i18n("Descubriendo tu invitación…")
              : i18n("Toca la apertura para probarla")}
        </span>
        {animation.phase === "done" && (
          <button onClick={animation.reset}>
            <Icon name="refresh" />
            {i18n("Ver de nuevo")}
          </button>
        )}
      </div>
    </section>
  );
}
