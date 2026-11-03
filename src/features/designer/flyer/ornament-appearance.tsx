import type { FlyerElement } from "@/lib/events/flyer";
export default function OrnamentAppearance({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  if (!item.icon?.startsWith("art:")) return null;
  return (
    <label>
      Intensidad del adorno{" "}
      <output>{Math.round((item.opacity ?? 1) * 100)}%</output>
      <input
        aria-label="Intensidad del adorno"
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
