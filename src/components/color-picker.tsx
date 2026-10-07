"use client";
import { useId, useState } from "react";
import Icon from "./icon";
import ColorPanel from "./color-panel";
import { normalizeColor } from "@/lib/ui/color";
export default function ColorPicker({
  value = "#AD7254",
  onChange,
  label = "Color",
}: {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false),
    id = useId();
  const color = normalizeColor(value) || "#AD7254";
  return (
    <div className="color-picker">
      <button
        type="button"
        className="color-trigger"
        aria-label={`Elegir ${label.toLowerCase()}`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
      >
        <span
          className="color-trigger-swatch"
          style={{ backgroundColor: color }}
        />
        <span>
          <strong>{color}</strong>
          <small>Personalizar color</small>
        </span>
        <Icon name="chevron" />
      </button>
      {open && (
        <ColorPanel
          id={id}
          value={color}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
