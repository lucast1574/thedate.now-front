import { useEffect, useRef } from "react";
export default function TimeColumn({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: number;
  values: number[];
  onChange: (value: number) => void;
}) {
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = list.current?.querySelector<HTMLButtonElement>(
      '[aria-selected="true"]',
    );
    if (node && list.current) {
      list.current.scrollTop =
        node.offsetTop -
        list.current.offsetTop -
        (list.current.clientHeight - node.clientHeight) / 2;
      if (label === "Hora") node.focus();
    }
  }, [value, label]);
  return (
    <div className="time-column">
      <span>{label}</span>
      <div ref={list} className="time-values" role="listbox" aria-label={label}>
        {values.map((item, i) => (
          <button
            type="button"
            key={item}
            role="option"
            aria-selected={item === value}
            tabIndex={item === value ? 0 : -1}
            onClick={() => onChange(item)}
            onKeyDown={(e) => {
              const next =
                e.key === "ArrowDown"
                  ? Math.min(values.length - 1, i + 1)
                  : e.key === "ArrowUp"
                    ? Math.max(0, i - 1)
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? values.length - 1
                        : -1;
              if (next < 0) return;
              e.preventDefault();
              onChange(values[next]);
              list.current
                ?.querySelectorAll<HTMLButtonElement>("button")
                [next]?.focus();
            }}
          >
            {item.toString().padStart(2, "0")}
          </button>
        ))}
      </div>
    </div>
  );
}
