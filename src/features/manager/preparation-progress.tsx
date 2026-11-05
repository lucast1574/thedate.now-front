import type { CSSProperties } from "react";
import { preparationProgress } from "@/lib/events/preparation-progress";

export default function PreparationProgress({
  phase,
  segment,
  visible,
}: {
  phase?: string;
  segment: number;
  visible: boolean;
}) {
  const { percent, label } = preparationProgress(phase);
  const fill = visible
    ? segment === 0
      ? Math.min(100, percent / 0.7)
      : Math.max(0, (percent - 70) / 0.3)
    : 0;
  const active =
    visible && percent < 100 && (segment === 0 ? percent < 90 : percent >= 90);
  return (
    <div className="delivery-connector" data-active={active}>
      {active && (
        <span className="delivery-connector-value" title="Avance estimado">
          {percent}%
        </span>
      )}
      <div
        className="delivery-connector-track"
        role={visible ? "progressbar" : undefined}
        aria-label={
          visible
            ? `${segment === 0 ? "Publicación" : "Comprobación del enlace"}: avance estimado`
            : undefined
        }
        aria-valuemin={visible ? 0 : undefined}
        aria-valuemax={visible ? 100 : undefined}
        aria-valuenow={visible ? percent : undefined}
        aria-valuetext={
          visible
            ? `${percent}%${percent < 100 ? " estimado" : ""}. ${label}`
            : undefined
        }
      >
        <span
          className="delivery-connector-fill"
          style={{ "--connector-progress": fill / 100 } as CSSProperties}
        />
        {active && (
          <span className="delivery-connector-light" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
