import { useState } from "react";
import TimeColumn from "./time-column";
import { timeParts, timeValue, timeLabel } from "@/lib/ui/date-time";
export default function TimePanel({
  value,
  onChoose,
}: {
  value: string;
  onChoose: (value: string) => void;
}) {
  const [time, setTime] = useState(() => timeParts(value));
  const selected = timeValue(time.hour, time.minute, time.period);
  return (
    <div className="time-panel">
      <p className="time-preview" aria-live="polite">
        {timeLabel(selected)}
      </p>
      <div className="time-columns">
        <TimeColumn
          label="Hora"
          value={time.hour}
          values={Array.from({ length: 12 }, (_, i) => i + 1)}
          onChange={(hour) => setTime({ ...time, hour })}
        />
        <span className="time-separator">:</span>
        <TimeColumn
          label="Minutos"
          value={time.minute}
          values={Array.from({ length: 60 }, (_, i) => i)}
          onChange={(minute) => setTime({ ...time, minute })}
        />
        <div className="time-period">
          <span>Momento</span>
          {["AM", "PM"].map((period) => (
            <button
              type="button"
              key={period}
              aria-pressed={time.period === period}
              onClick={() => setTime({ ...time, period })}
            >
              {period === "AM" ? "a. m." : "p. m."}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="time-apply"
        onClick={() => onChoose(selected)}
      >
        Usar esta hora
      </button>
    </div>
  );
}
