import type { CSSProperties, ReactNode } from "react";
import Photo from "./photo";
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
}: {
  guestName?: string;
  item: FlyerElement;
  photoURL: (key: string) => string;
}) {
  if (item.type === "image")
    return (
      <Photo
        src={photoURL(item.photoKey || "")}
        alt="Imagen de la invitación"
        draggable={false}
      />
    );
  return (
    <span>
      {item.type === "icon" ? (
        <Icon name={item.icon || "none"} />
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
  label = "Sección de la invitación",
}: {
  canvas: FlyerCanvas;
  guestName?: string;
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
            />
          </div>
        ))}
    </div>
  );
}
