import type { FlyerElement } from "@/lib/events/flyer";
export default function TextSpacingFields({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  return (
    <div className="studio-type-detail">
      <button
        type="button"
        aria-label="Cursiva"
        aria-pressed={!!item.italic}
        onClick={() => onChange({ italic: !item.italic })}
      >
        <i>Cursiva</i>
      </button>
      <label>
        Interlineado <output>{(item.lineHeight ?? 1.2).toFixed(2)}</output>
        <input
          aria-label="Interlineado"
          type="range"
          min="0.8"
          max="2.4"
          step="0.05"
          value={item.lineHeight ?? 1.2}
          onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
        />
      </label>
      <label>
        Espacio entre letras{" "}
        <output>{Math.round((item.letterSpacing ?? 0) * 100)}%</output>
        <input
          aria-label="Espacio entre letras"
          type="range"
          min="-0.08"
          max="0.3"
          step="0.01"
          value={item.letterSpacing ?? 0}
          onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}
