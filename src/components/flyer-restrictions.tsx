import Icon from "./icon";
import type { FlyerElement } from "@/lib/events/flyer";
export default function FlyerRestrictions({ item }: { item: FlyerElement }) {
  const style = item.restrictionStyle || "icon-text";
  return (
    <span
      className="restriction-composition"
      data-align={item.align}
      data-style={style}
    >
      {style !== "text" && (
        <span className="restriction-composition-icon">
          <Icon name={item.restrictionIcon || "lucide:shield-alert"} />
        </span>
      )}
      {style !== "icon" && (
        <span>
          {item.text || "Ten en cuenta estas indicaciones antes de asistir."}
        </span>
      )}
    </span>
  );
}
