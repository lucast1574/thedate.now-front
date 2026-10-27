import Icon from "./icon";
import Photo from "./photo";
import type { FlyerElement } from "@/lib/events/flyer";
import { dressParts } from "@/lib/events/dress-code";
import { templatePhotoURL } from "@/lib/events/template-photos";
export default function FlyerDressCode({
  item,
  photoURL,
}: {
  item: FlyerElement;
  photoURL: (key: string) => string;
}) {
  const parts = dressParts(item.dressStyle);
  const key = item.dressPhotoKey || "template-photo";
  return (
    <span
      className="dress-composition"
      data-align={item.align}
      data-media-only={!parts.includes("text") || undefined}
    >
      {parts.includes("icon") && (
        <span className="dress-composition-icon">
          <Icon name={item.dressIcon || "lucide:shirt"} />
        </span>
      )}
      {parts.includes("image") && (
        <span className="dress-composition-image" data-dress-image="true">
          <Photo
            src={templatePhotoURL(key) || photoURL(key)}
            alt="Referencia de vestimenta"
            draggable={false}
          />
        </span>
      )}
      {parts.includes("text") && (
        <span className="dress-composition-text">
          {item.text || "Dress code"}
        </span>
      )}
    </span>
  );
}
