import Photo from "./photo";
import TemplatePhotoPlaceholder from "./template-photo-placeholder";
import { templatePhotoURL } from "@/lib/events/template-photos";
import type { FlyerElement } from "@/lib/events/flyer";
export default function InvitationPhoto({
  item,
  photoURL,
}: {
  item: FlyerElement;
  photoURL: (key: string) => string;
}) {
  const placeholder = item.photoKey === "template-photo";
  const src = placeholder
    ? undefined
    : templatePhotoURL(item.photoKey || "") || photoURL(item.photoKey || "");
  return (
    <span
      className="invitation-photo"
      data-treatment={item.photoTreatment || "none"}
    >
      {item.photoTreatment === "soft" && src && (
        <Photo
          className="invitation-photo-glow"
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      )}
      {placeholder ? (
        <TemplatePhotoPlaceholder />
      ) : (
        <Photo
          src={src}
          style={{ objectFit: item.photoFit || "contain" }}
          alt="Imagen de la invitación"
          draggable={false}
        />
      )}
    </span>
  );
}
