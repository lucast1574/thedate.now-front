import { useTranslator } from "@/lib/i18n/react";
import type { FlyerElement } from "@/lib/events/flyer";
export default function OrnamentAppearance({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  if (!item.icon?.startsWith("art:")) return null;
  return (
    <label>
      {i18n("Intensidad del adorno")}{" "}
      <output>{Math.round((item.opacity ?? 1) * 100)}%</output>
      <input
        aria-label={i18n("Intensidad del adorno")}
        type="range"
        min="0.05"
        max="1"
        step="0.05"
        value={item.opacity ?? 1}
        onChange={(e) => onChange({ opacity: Number(e.target.value) })}
      />
    </label>
  );
}
