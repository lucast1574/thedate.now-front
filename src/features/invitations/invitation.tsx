import InvitationMotion from "./invitation-motion";
import InvitationMusic from "./invitation-music";
import Icon from "@/components/icon";
import { invitationPaper } from "@/lib/events/invitation-paper";
import InvitationBrand from "./invitation-brand";
import Photo from "@/components/photo";
import type { PublicEvent } from "@/lib/events/types";
import InvitationSections from "./invitation-sections";
export default function Invitation({
  giftURL,
  showBrand = true,
  event,
  photoURL,
  audioURL,
  preview = false,
  guestName,
}: {
  giftURL?: string;
  showBrand?: boolean;
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
          guestName={guestName}
          sections={event.sections}
          kind={event.kind}
          slug={event.slug}
          flyer={event.designMode === "flyer"}
          photoURL={photo}
        />
        {event.wishlistEnabled && (
          <a className="invitation-gifts-link" href={giftURL || "/regalos"}>
            <Icon name="lucide:gift" />
            <span>Lista de regalos</span>
            <Icon name="arrow" />
          </a>
        )}
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
