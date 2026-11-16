import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

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
      <h4>{i18n("Elementos visibles")}</h4>
      <p>{i18n("Combina las partes que quieras mostrar.")}</p>
      <div
        className="location-part-options"
        role="group"
        aria-label={i18n("Elementos de la ubicación")}
      >
        {(
          [
            ["icon", i18n("Icono"), "lucide:map-pin"],
            ["label", i18n("Título"), "lucide:type"],
            ["address", i18n("Dirección"), "lucide:map-pinned"],
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
        aria-label={i18n("Vista previa de la ubicación")}
      >
        <LocationContent item={item} />
      </div>
    </div>
  );
}
