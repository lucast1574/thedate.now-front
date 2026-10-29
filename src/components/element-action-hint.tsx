import Icon from "./icon";
import type { FlyerElement } from "@/lib/events/flyer";
export default function ElementActionHint({
  item,
  label,
}: {
  item: FlyerElement;
  label: string;
}) {
  if (!item.actionHint) return null;
  return (
    <span
      className="element-action-hint"
      data-style={item.hintStyle || "icon-text"}
    >
      {item.hintStyle !== "text" && <Icon name={item.hintIcon || "external"} />}
      {item.hintStyle !== "icon" && <span>{item.hintText || label}</span>}
    </span>
  );
}
