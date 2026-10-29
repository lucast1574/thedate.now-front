import FlyerBackground from "./flyer-background";
import InvitationMap from "./invitation-map";
import { elementValue } from "@/lib/events/element-values";
import type { PublicEvent } from "@/lib/events/types";
import type { BackgroundSlice } from "@/lib/events/background";
import type { CSSProperties, ReactNode } from "react";
import { templatePhotoURL } from "@/lib/events/template-photos";
import FlyerGiftLink from "./flyer-gift-link";
import FlyerDressCode from "./flyer-dress-code";
import FlyerRestrictions from "./flyer-restrictions";
import Photo from "./photo";
import TemplatePhotoPlaceholder from "./template-photo-placeholder";
import FlyerLocation from "./flyer-location";
import {
  flyerFonts,
  type FlyerCanvas,
  type FlyerElement,
} from "@/lib/events/flyer";
import Icon from "./icon";
import { personalizedText } from "@/lib/events/guest-name";
export function flyerElementStyle(
  item: FlyerElement,
  canvas: FlyerCanvas,
): CSSProperties {
  return {
    left: `${(item.x / canvas.width) * 100}%`,
    top: `${(item.y / canvas.height) * 100}%`,
    width: `${(item.width / canvas.width) * 100}%`,
    height: `${(item.height / canvas.height) * 100}%`,
    transform: `rotate(${item.rotation}deg)`,
    color: item.color,
    fontFamily: flyerFonts[item.font],
    fontSize: `${(item.fontSize / canvas.width) * 100}cqw`,
    fontWeight: item.bold ? 700 : 400,
    textAlign: item.align,
  };
}
export function FlyerContent({
  item,
  photoURL,
  guestName,
  giftURL,
  event,
}: {
  event?: Partial<PublicEvent>;
  giftURL?: string;
  guestName?: string;
  item: FlyerElement;
  photoURL: (key: string) => string;
}) {
  item = elementValue(item, event);
  if (item.binding === "map") return <InvitationMap item={item} />;
  if (item.type === "image" && item.photoKey === "template-photo")
    return <TemplatePhotoPlaceholder />;
  if (item.type === "image")
    return (
      <Photo
        src={
          templatePhotoURL(item.photoKey || "") || photoURL(item.photoKey || "")
        }
        style={{ objectFit: "contain" }}
        alt="Imagen de la invitación"
        draggable={false}
      />
    );
  if (item.binding === "gift_link")
    return <FlyerGiftLink item={item} giftURL={giftURL} />;
  if (item.binding === "dress_code")
    return <FlyerDressCode item={item} photoURL={photoURL} />;
  if (item.binding === "restrictions") return <FlyerRestrictions item={item} />;
  if (item.binding === "location") return <FlyerLocation item={item} />;
  return (
    <span
      style={
        item.type === "icon"
          ? {
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }
          : undefined
      }
    >
      {item.type === "icon" ? (
        <Icon
          name={item.icon || "none"}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        personalizedText(item, guestName)
      )}
    </span>
  );
}
export default function FlyerSurface({
  canvas,
  photoURL,
  children,
  guestName,
  giftURL,
  event,
  backgroundSlice,
  label = "Sección de la invitación",
}: {
  event?: Partial<PublicEvent>;
  canvas: FlyerCanvas;
  guestName?: string;
  giftURL?: string;
  backgroundSlice?: BackgroundSlice;
  photoURL: (key: string) => string;
  children?: ReactNode;
  label?: string;
}) {
  return (
    <div
      className="flyer-surface"
      role="group"
      aria-label={label}
      style={{
        aspectRatio: `${canvas.width} / ${canvas.height}`,
        background: canvas.background,
      }}
    >
      {(backgroundSlice ||
        (!canvas.backgroundOverride && canvas.backgroundImage)) && (
        <FlyerBackground
          slice={
            backgroundSlice || {
              image: canvas.backgroundImage!,
              offset: 0,
              total: 1,
              height: 1,
            }
          }
          photoURL={photoURL}
        />
      )}
      {children ??
        canvas.elements.map((item) => (
          <div
            key={item.id}
            className="flyer-element"
            style={flyerElementStyle(item, canvas)}
          >
            <FlyerContent
              item={item}
              photoURL={photoURL}
              guestName={guestName}
              giftURL={giftURL}
              event={event}
            />
          </div>
        ))}
    </div>
  );
}
