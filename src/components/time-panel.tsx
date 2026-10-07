import { useEffect, useRef, useState } from "react";
import {
  halfHourTimes,
  timeParts,
  timeLabel,
  timeValue,
} from "@/lib/ui/date-time";
export default function TimePanel({
  value,
  onChoose,
}: {
  value: string;
  onChoose: (value: string) => void;
}) {
  const [period, setPeriod] = useState(() => timeParts(value).period);
  const list = useRef<HTMLDivElement>(null);
  const times = halfHourTimes(period);
  const parts = timeParts(value);
  const initial = Math.max(
    0,
    times.indexOf(
      timeValue(parts.hour, parts.minute >= 30 ? 30 : 0, parts.period),
    ),
  );
  useEffect(() => {
    const node =
      list.current?.querySelector<HTMLButtonElement>('[tabindex="0"]');
    if (node && list.current) {
      const rowStep =
        node.offsetHeight + parseFloat(getComputedStyle(list.current).rowGap);
      list.current.scrollTop = Math.max(
        0,
        Math.floor((node.offsetTop - list.current.offsetTop - 80) / rowStep) *
          rowStep,
      );
      node.focus({ preventScroll: true });
    }
  }, [period]);
  return (
    <div className="time-panel">
      <p className="time-hint">Elige una hora, en punto o y media.</p>
      <div className="time-period" role="group" aria-label="Momento del día">
        {[
          ["AM", "Madrugada y mañana"],
          ["PM", "Tarde y noche"],
        ].map(([key, text]) => (
          <button
            type="button"
            key={key}
            aria-pressed={period === key}
            onClick={() => setPeriod(key)}
          >
            <strong>{key}</strong>
            <span>{text}</span>
          </button>
        ))}
      </div>
      <div
        ref={list}
        className="time-options"
        role="group"
        aria-label="Horas disponibles"
      >
        {times.map((time, i) => (
          <button
            type="button"
            key={time}
            tabIndex={i === initial ? 0 : -1}
            aria-label={timeLabel(time)}
            aria-pressed={time === value}
            onClick={() => onChoose(time)}
            onKeyDown={(e) => {
              const next =
                e.key === "ArrowRight"
                  ? i + 1
                  : e.key === "ArrowLeft"
                    ? i - 1
                    : e.key === "ArrowDown"
                      ? i + 3
                      : e.key === "ArrowUp"
                        ? i - 3
                        : e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? times.length - 1
                            : null;
              if (next === null) return;
              e.preventDefault();
              list.current
                ?.querySelectorAll<HTMLButtonElement>("button")
                [Math.max(0, Math.min(times.length - 1, next))]?.focus();
            }}
          >
            {timeLabel(time).split(" ")[0]}
          </button>
        ))}
      </div>
      {value && !times.includes(value) && (
        <p className="time-current">
          Hora actual: <strong>{timeLabel(value)}</strong>
        </p>
      )}
    </div>
  );
}
