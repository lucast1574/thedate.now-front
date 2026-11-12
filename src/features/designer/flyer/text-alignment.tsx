import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";

export default function TextAlignment({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  return (
    <div
      className="inspector-alignment"
      role="group"
      aria-label="Alineación del texto"
    >
      {(
        [
          ["left", "Izquierda", "lucide:text-align-start"],
          ["center", "Centro", "lucide:text-align-center"],
          ["right", "Derecha", "lucide:text-align-end"],
        ] as const
      ).map(([align, label, icon]) => (
        <button
          type="button"
          key={align}
          title={label}
          aria-label={`Alinear ${label.toLowerCase()}`}
          aria-pressed={item.align === align}
          onClick={() => onChange({ align })}
        >
          <Icon name={icon} />
        </button>
      ))}
    </div>
  );
}
