import type { PointerEvent } from "react";
import { hsvToHex, colorAdjustmentKey, type HSV } from "@/lib/ui/color";
export default function ColorPlane({
  hsv,
  onChange,
  onCommit,
}: {
  hsv: HSV;
  onChange: (next: HSV) => void;
  onCommit: (next: HSV) => void;
}) {
  function position(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      ...hsv,
      s: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      v: 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  }
  return (
    <>
      <div
        className="color-plane"
        style={{ backgroundColor: hsvToHex({ h: hsv.h, s: 1, v: 1 }) }}
        role="group"
        aria-label="Saturación y luminosidad"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          onChange(position(e));
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            onChange(position(e));
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            onCommit(position(e));
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
      >
        <span
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
        />
      </div>
      <label className="color-slider-label">
        Tono
        <input
          className="color-hue"
          type="range"
          min="0"
          max="359"
          value={Math.round(hsv.h)}
          onChange={(e) => onChange({ ...hsv, h: Number(e.target.value) })}
          onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
          onPointerUp={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              onCommit({ ...hsv, h: Number(e.currentTarget.value) });
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
          }}
          onKeyUp={(e) => {
            if (colorAdjustmentKey(e.key))
              onCommit({ ...hsv, h: Number(e.currentTarget.value) });
          }}
        />
      </label>
      <div className="color-adjustments">
        {(
          [
            ["s", "Saturación"],
            ["v", "Luminosidad"],
          ] as const
        ).map(([field, label]) => (
          <label key={field}>
            {label}
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(hsv[field] * 100)}
              onChange={(e) =>
                onChange({ ...hsv, [field]: Number(e.target.value) / 100 })
              }
              onPointerDown={(e) =>
                e.currentTarget.setPointerCapture(e.pointerId)
              }
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  onCommit({
                    ...hsv,
                    [field]: Number(e.currentTarget.value) / 100,
                  });
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
              }}
              onKeyUp={(e) => {
                if (colorAdjustmentKey(e.key))
                  onCommit({
                    ...hsv,
                    [field]: Number(e.currentTarget.value) / 100,
                  });
              }}
            />
          </label>
        ))}
      </div>
    </>
  );
}
