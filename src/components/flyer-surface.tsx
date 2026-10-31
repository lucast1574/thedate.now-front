import { fitDressCanvas } from "@/lib/events/dress-layout";
import InvitationPhoto from "./invitation-photo";
import InvitationArtwork from "./invitation-artwork";
import { fitInvitationText } from "@/lib/events/fit-invitation-text";
import FlyerBackground from "./flyer-background";
import InvitationMap from "./invitation-map";
import { elementValue } from "@/lib/events/element-values";
import type { PublicEvent } from "@/lib/events/types";
import type { BackgroundSlice } from "@/lib/events/background";
import type { CSSProperties, ReactNode } from "react";
import FlyerCalendarLink from "./flyer-calendar-link";
import FlyerGiftLink from "./flyer-gift-link";
import FlyerDressCode from "./flyer-dress-code";
import FlyerRestrictions from "./flyer-restrictions";
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
  if (item.type === "image")
    return <InvitationPhoto item={item} photoURL={photoURL} />;
  if (item.binding === "rsvp_link")
    return giftURL ? (
      <a
        className="flyer-rsvp-link"
        href={giftURL.replace(/\/regalos$/, "/respuesta")}
      >
        <Icon name="mail" />
        {item.text || "Confirmar asistencia"}
        <Icon name="arrow" />
      </a>
    ) : (
      <span className="flyer-rsvp-link">
        {item.text || "Confirma tu asistencia en WhatsApp"}
      </span>
    );
  if (item.binding === "calendar_link")
    return <FlyerCalendarLink item={item} event={event} />;
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
  canvas: authoredCanvas,
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
  const canvas = children
    ? authoredCanvas
    : fitDressCanvas({
        ...authoredCanvas,
        elements: authoredCanvas.elements.map((e) => elementValue(e, event)),
      });
  return (
    <div
      data-art={canvas.art}
      className="flyer-surface"
      role="group"
      aria-label={label}
      style={{
        aspectRatio: `${canvas.width} / ${canvas.height}`,
        background: canvas.background,
      }}
    >
      <InvitationArtwork
        style={canvas.art}
        color={
          event?.accentColor ||
          canvas.elements.find((e) => e.type !== "image")?.color ||
          "#555555"
        }
      />
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
            data-element={item.binding || item.type}
            data-title={item.fontSize >= 48 || undefined}
            style={flyerElementStyle(
              {
                ...item,
                fontSize: fitInvitationText(elementValue(item, event)),
              },
              canvas,
            )}
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
