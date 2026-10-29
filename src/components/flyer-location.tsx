import Icon from "./icon";
import ElementActionHint from "./element-action-hint";
import type { FlyerElement } from "@/lib/events/flyer";
import { locationHref, locationParts } from "@/lib/events/location-element";
export function LocationContent({ item }: { item: FlyerElement }) {
  const parts = locationParts(item.locationStyle),
    onlyIcon = parts.length === 1 && parts[0] === "icon";
  return (
    <span
      className="location-composition"
      data-icon-only={onlyIcon || undefined}
      data-align={item.align}
    >
      {parts.includes("icon") && (
        <span className="location-composition-icon">
          <Icon
            name="lucide:map-pin"
            style={{ width: "100%", height: "100%" }}
          />
        </span>
      )}
      {parts.includes("label") && (
        <span className="location-composition-title">
          {item.text || "Cómo llegar"}
        </span>
      )}
      {parts.includes("address") && (
        <span
          className={`location-composition-address ${parts.includes("label") ? "is-secondary" : ""}`}
        >
          {item.address || "Dirección del evento"}
        </span>
      )}
    </span>
  );
}
export default function FlyerLocation({ item }: { item: FlyerElement }) {
  const href = locationHref(item);
  const label =
    locationParts(item.locationStyle).length === 1 &&
    item.locationStyle === "icon"
      ? `Ver ubicación: ${item.address || "Google Maps"}`
      : undefined;
  return href ? (
    <a
      className="flyer-location"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <LocationContent item={item} />
      <ElementActionHint item={item} label="Cómo llegar" />
    </a>
  ) : (
    <span className="flyer-location">
      <LocationContent item={item} />
    </span>
  );
}
