import InvitationOpening from "./invitation-opening";
import { resolvedOpening } from "@/lib/events/opening-presets";
import InvitationMotion from "./invitation-motion";
import InvitationMusic from "./invitation-music";
import { invitationPaper } from "@/lib/events/invitation-paper";
import InvitationBrand from "./invitation-brand";
import Photo from "@/components/photo";
import type { PublicEvent } from "@/lib/events/types";
import InvitationSections from "./invitation-sections";
export default function Invitation({
  giftURL,
  showBrand = true,
  showOpening = true,
  event,
  photoURL,
  audioURL,
  preview = false,
  guestName,
}: {
  giftURL?: string;
  showBrand?: boolean;
  showOpening?: boolean;
  event: PublicEvent;
  guestName?: string;
  photoURL?: (key: string) => string;
  audioURL?: (key: string) => string;
  preview?: boolean;
}) {
  const photo =
    photoURL ??
    ((key: string) =>
      `/api/public-photos/${event.kind}/${event.slug}/${encodeURIComponent(key)}`);
  const accent = /^#[0-9a-fA-F]{6}$/.test(event.accentColor)
    ? event.accentColor
    : "#ad7254";
  const paper = invitationPaper(event);
  return (
    <main
      className={`invitation ${event.template === "modern" ? "invitation-modern" : ""}`}
      data-invitation-event={preview ? undefined : event.id}
      data-template={event.templateId}
      data-product={event.kind}
      data-design={event.designMode || "sections"}
      style={
        {
          "--accent": accent,
          "--invite-paper": paper.background,
        } as React.CSSProperties
      }
    >
      <InvitationMotion />
      {showOpening && event.opening?.enabled && (
        <InvitationOpening
          opening={resolvedOpening(event)!}
          photoURL={photo}
          title={event.title}
          wedding={event.kind === "wedding"}
        />
      )}
      <section className="invite-content">
        {event.designMode !== "flyer" && (
          <>
            <h1>{event.title}</h1>
            <p className="description">{event.description}</p>
            {event.photoKeys?.length > 0 && (
              <div className="invite-gallery">
                {event.photoKeys.slice(0, 6).map((key) => (
                  <Photo
                    key={key}
                    src={photo(key)}
                    alt={`Recuerdo de ${event.title}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
        <InvitationSections
          event={event}
          guestName={guestName}
          giftURL={giftURL}
          backgroundImage={event.backgroundImage}
          sections={event.sections}
          kind={event.kind}
          slug={event.slug}
          flyer={event.designMode === "flyer"}
          photoURL={photo}
        />
      </section>
      <InvitationMusic
        music={event.music}
        preview={Boolean(audioURL)}
        audioSrc={
          event.music?.source === "mp3"
            ? (audioURL?.(event.music.value) ??
              `/api/public-audio/${event.kind}/${event.slug}/${event.music.value}`)
            : undefined
        }
      />
      {showBrand && <InvitationBrand event={event} />}
    </main>
  );
}
