import InvitationMusic from "./invitation-music";
import Icon from "@/components/icon";
import EventDetails from "@/components/event-details";
import Photo from "@/components/photo";
import type { PublicEvent } from "@/lib/events/types";
import Brand from "@/components/brand";
import InvitationSections from "./invitation-sections";
export default function Invitation({
  giftURL,
  event,
  photoURL,
  audioURL,
  preview = false,
  guestName,
}: {
  giftURL?: string;
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
  const virtual = event.kind === "general" && event.isVirtual;
  const placeLink = virtual ? event.virtualUrl : event.mapUrl;
  const safeLink =
    typeof placeLink === "string" && /^https:\/\/[^\s]+$/i.test(placeLink)
      ? placeLink
      : "";
  return (
    <main
      className={`invitation ${event.template === "modern" ? "invitation-modern" : ""}`}
      data-invitation-event={preview ? undefined : event.id}
      data-template={event.templateId}
      data-product={event.kind}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <header className="invite-top">
        <a
          href={
            event.kind === "wedding"
              ? "https://save.thedate.now"
              : "https://thedate.now"
          }
        >
          <Brand wedding={event.kind === "wedding"} />
        </a>
        <span>UNA INVITACIÓN ESPECIAL</span>
      </header>
      <section className="invite-content">
        {event.designMode !== "flyer" && (
          <>
            <div className="ornament">
              <Icon name={event.kind === "wedding" ? "flower" : "sparkle"} />
            </div>
            <p className="eyebrow">
              {event.kind === "wedding"
                ? "CELEBREMOS EL AMOR"
                : "ESTÁS INVITADO"}
            </p>
            <h1>{event.title}</h1>
            <div className="rule" />
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
        {guestName &&
          !event.sections?.some(
            (s) =>
              s.guestText ||
              s.canvas?.elements.some((el) => el.binding === "guest_name"),
          ) && (
            <p className="personal-guest-name">
              Una invitación para {guestName}
            </p>
          )}
        <InvitationSections
          guestName={guestName}
          sections={event.sections}
          kind={event.kind}
          slug={event.slug}
          flyer={event.designMode === "flyer"}
          photoURL={photo}
        />
        <EventDetails event={event} />
        {safeLink && (
          <>
            <a
              className="invite-place-link"
              href={safeLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {virtual
                ? "Unirse al evento virtual"
                : "Cómo llegar con Google Maps"}{" "}
              ↗
            </a>
            {!virtual && (
              <small className="map-credit">
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  © OpenStreetMap contributors
                </a>
              </small>
            )}
          </>
        )}
        {event.wishlistEnabled && (
          <a className="invitation-gifts-link" href={giftURL || "/regalos"}>
            <Icon name="lucide:gift" />
            <span>
              Lista de regalos
              <small>Elige un detalle para la celebración</small>
            </span>
            <Icon name="arrow" />
          </a>
        )}
        {preview && (
          <p className="preview-demo-note">Vista previa · {event.title}</p>
        )}
        <p className="closing">Nos encantará compartir este momento contigo.</p>
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
      <footer className="invite-footer">
        Una invitación creada con <b>the date.</b>
      </footer>
    </main>
  );
}
