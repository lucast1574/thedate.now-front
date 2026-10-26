import Icon from "@/components/icon";
import { LocationContent } from "@/components/flyer-location";
import type { FlyerElement } from "@/lib/events/flyer";
import {
  locationParts,
  toggleLocationPart,
  type LocationPart,
} from "@/lib/events/location-element";
export default function LocationPresentation({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const parts = locationParts(item.locationStyle);
  function toggle(part: LocationPart) {
    const locationStyle = toggleLocationPart(item.locationStyle, part);
    if (locationStyle === item.locationStyle) return;
    const next = locationParts(locationStyle),
      onlyIcon = locationStyle === "icon";
    onChange({
      locationStyle,
      width: onlyIcon ? 96 : item.locationStyle === "icon" ? 400 : item.width,
      height: onlyIcon
        ? 96
        : next.includes("icon")
          ? next.length === 3
            ? 260
            : 220
          : next.length === 2
            ? 160
            : 120,
    });
  }
  return (
    <div className="location-presentation">
      <h4>Elementos visibles</h4>
      <p>Combina las partes que quieras mostrar.</p>
      <div
        className="location-part-options"
        role="group"
        aria-label="Elementos de la ubicación"
      >
        {(
          [
            ["icon", "Icono", "lucide:map-pin"],
            ["label", "Título", "lucide:type"],
            ["address", "Dirección", "lucide:map-pinned"],
          ] as const
        ).map(([part, label, icon]) => (
          <button
            key={part}
            aria-pressed={parts.includes(part)}
            onClick={() => toggle(part)}
          >
            <Icon name={icon} />
            <span>{label}</span>
            <span className="location-part-check">
              <Icon name="check" />
            </span>
          </button>
        ))}
      </div>
      <div
        className="location-mini-preview"
        aria-label="Vista previa de la ubicación"
      >
        <LocationContent item={item} />
      </div>
    </div>
  );
}
