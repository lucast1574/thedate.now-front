import {
  sectionBackground,
  type ImageBackground,
} from "@/lib/events/background";
import FlyerSurface from "@/components/flyer-surface";
import Photo from "@/components/photo";
import type { DesignSection } from "@/lib/events/types";
import Icon from "@/components/icon";

export default function InvitationSections({
  sections,
  kind,
  slug,
  flyer = false,
  photoURL,
  guestName,
  giftURL,
  backgroundImage,
}: {
  guestName?: string;
  giftURL?: string;
  backgroundImage?: ImageBackground | null;
  sections?: DesignSection[];
  kind: "wedding" | "general";
  slug: string;
  flyer?: boolean;
  photoURL?: (key: string) => string;
}) {
  const photo =
    photoURL ??
    ((key: string) =>
      `/api/public-photos/${kind}/${slug}/${encodeURIComponent(key)}`);
  if (!sections?.length) return null;
  return (
    <div className="invite-sections">
      {sections.map((section, index) =>
        flyer && section.canvas ? (
          <FlyerSurface
            key={section.id}
            guestName={guestName}
            giftURL={giftURL}
            backgroundSlice={sectionBackground(
              sections,
              index,
              backgroundImage,
            )}
            canvas={section.canvas}
            photoURL={photo}
            label={section.heading || "Lienzo"}
          />
        ) : (
          <section key={section.id} className="invite-section">
            <span aria-hidden="true">
              <Icon name={section.icon} />
            </span>
            <h2>{section.heading}</h2>
            {section.guestText && (
              <FlyerSurface
                canvas={{
                  width: 720,
                  height: 240,
                  background: "transparent",
                  elements: [section.guestText],
                }}
                guestName={guestName}
                photoURL={photo}
                label="Nombre personalizado del invitado"
              />
            )}
            <p>{section.body}</p>
            {section.photoKey && (
              <Photo
                src={photo(section.photoKey)}
                alt={section.heading || "Foto de la invitación"}
              />
            )}
          </section>
        ),
      )}
    </div>
  );
}
