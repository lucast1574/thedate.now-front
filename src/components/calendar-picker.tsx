import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Icon from "./icon";
import {
  calendarDays,
  dateKey,
  localDay,
  moveDay,
  moveMonth,
} from "@/lib/ui/date-time";
export default function CalendarPicker({
  value,
  onChoose,
}: {
  value: string;
  onChoose: (value: string) => void;
}) {
  const today = new Date(),
    initial = localDay(value) || today,
    todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const [year, setYear] = useState(initial.getFullYear()),
    [month, setMonth] = useState(initial.getMonth());
  const [view, setView] = useState<"days" | "months" | "years">("days"),
    [active, setActive] = useState(value || todayKey);
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    grid.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${active}"]`)
      ?.focus();
  }, [active, month, year, view]);
  function showDays(nextYear: number, nextMonth: number) {
    const day = Math.min(
      localDay(active)?.getDate() || 1,
      new Date(nextYear, nextMonth + 1, 0, 12).getDate(),
    );
    setYear(nextYear);
    setMonth(nextMonth);
    setActive(dateKey(nextYear, nextMonth, day));
    setView("days");
  }
  function changeMonth(amount: number) {
    const date = new Date(year, month + amount, 1, 12);
    showDays(date.getFullYear(), date.getMonth());
  }
  function key(e: KeyboardEvent<HTMLButtonElement>, day: string) {
    let next = day;
    if (e.key === "ArrowRight") next = moveDay(day, 1);
    else if (e.key === "ArrowLeft") next = moveDay(day, -1);
    else if (e.key === "ArrowDown") next = moveDay(day, 7);
    else if (e.key === "ArrowUp") next = moveDay(day, -7);
    else if (e.key === "PageDown") next = moveMonth(day, 1);
    else if (e.key === "PageUp") next = moveMonth(day, -1);
    else if (e.key === "Home")
      next = moveDay(day, -((localDay(day)!.getDay() + 6) % 7));
    else if (e.key === "End")
      next = moveDay(day, 6 - ((localDay(day)!.getDay() + 6) % 7));
    else return;
    e.preventDefault();
    const date = localDay(next)!;
    setActive(next);
    setYear(date.getFullYear());
    setMonth(date.getMonth());
  }
  const monthName = new Date(year, month, 1, 12).toLocaleDateString("es", {
    month: "long",
  });
  return (
    <div className="calendar-picker">
      <div className="calendar-navigation">
        <button
          type="button"
          aria-label={view === "days" ? "Mes anterior" : "Años anteriores"}
          onClick={() =>
            view === "days"
              ? changeMonth(-1)
              : setYear(year - (view === "years" ? 12 : 1))
          }
        >
          <Icon name="chevron" className="calendar-prev" />
        </button>
        <div>
          <button
            type="button"
            onClick={() => setView(view === "months" ? "days" : "months")}
          >
            {monthName}
          </button>
          <button
            type="button"
            onClick={() => setView(view === "years" ? "days" : "years")}
          >
            {year}
          </button>
        </div>
        <button
          type="button"
          aria-label={view === "days" ? "Mes siguiente" : "Años siguientes"}
          onClick={() =>
            view === "days"
              ? changeMonth(1)
              : setYear(year + (view === "years" ? 12 : 1))
          }
        >
          <Icon name="chevron" className="calendar-next" />
        </button>
      </div>
      {view === "days" ? (
        <>
          <div className="calendar-weekdays" aria-hidden="true">
            {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
              <span key={i}>{day}</span>
            ))}
          </div>
          <div
            ref={grid}
            className="calendar-days"
            role="group"
            aria-label={`${monthName} ${year}`}
          >
            {calendarDays(year, month).map((day, i) =>
              day ? (
                <button
                  type="button"
                  key={day}
                  data-date={day}
                  tabIndex={day === active ? 0 : -1}
                  aria-label={localDay(day)!.toLocaleDateString("es", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  aria-pressed={day === value}
                  aria-current={day === todayKey ? "date" : undefined}
                  onFocus={() => setActive(day)}
                  onKeyDown={(e) => key(e, day)}
                  onClick={() => onChoose(day)}
                >
                  {Number(day.slice(8))}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>
        </>
      ) : (
        <div className="calendar-choices">
          {view === "months"
            ? Array.from({ length: 12 }, (_, i) => (
                <button
                  type="button"
                  key={i}
                  aria-pressed={i === month}
                  onClick={() => showDays(year, i)}
                >
                  {new Date(year, i, 1, 12).toLocaleDateString("es", {
                    month: "short",
                  })}
                </button>
              ))
            : Array.from({ length: 12 }, (_, i) => year - 5 + i).map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-pressed={item === year}
                  onClick={() => {
                    setYear(item);
                    setView("months");
                  }}
                >
                  {item}
                </button>
              ))}
        </div>
      )}
      <button
        type="button"
        className="calendar-today"
        onClick={() => onChoose(todayKey)}
      >
        Hoy
      </button>
    </div>
  );
}
