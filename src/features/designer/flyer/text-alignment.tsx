import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";

export default function TextAlignment({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  return (
    <div
      className="inspector-alignment"
      role="group"
      aria-label={i18n("Alineación del texto")}
    >
      {(
        [
          ["left", i18n("Izquierda"), "lucide:text-align-start"],
          ["center", i18n("Centro"), "lucide:text-align-center"],
          ["right", i18n("Derecha"), "lucide:text-align-end"],
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
