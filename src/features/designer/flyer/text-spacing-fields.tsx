import type { FlyerElement } from "@/lib/events/flyer";
export default function TextSpacingFields({
  item,
  onChange,
  compact = false,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "canvas-text-spacing" : "studio-type-detail"}>
      {!compact && (
        <button
          type="button"
          aria-label="Cursiva"
          aria-pressed={!!item.italic}
          onClick={() => onChange({ italic: !item.italic })}
        >
          <i>Cursiva</i>
        </button>
      )}
      <label>
        Interlineado{" "}
        {!compact && <output>{(item.lineHeight ?? 1.2).toFixed(2)}</output>}
        <input
          aria-label="Interlineado"
          type={compact ? "number" : "range"}
          min="0.8"
          max="2.4"
          step="0.05"
          value={item.lineHeight ?? 1.2}
          onChange={(e) =>
            onChange({
              lineHeight: Math.max(0.8, Math.min(2.4, Number(e.target.value))),
            })
          }
        />
      </label>
      <label>
        {compact ? "Espaciado" : "Espacio entre letras"}{" "}
        {!compact && (
          <output>{Math.round((item.letterSpacing ?? 0) * 100)}%</output>
        )}
        <input
          aria-label="Espacio entre letras"
          type={compact ? "number" : "range"}
          min="-0.08"
          max="0.3"
          step="0.01"
          value={item.letterSpacing ?? 0}
          onChange={(e) =>
            onChange({
              letterSpacing: Math.max(
                -0.08,
                Math.min(0.3, Number(e.target.value)),
              ),
            })
          }
        />
      </label>
    </div>
  );
}
