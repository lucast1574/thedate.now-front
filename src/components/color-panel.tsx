import { useState } from "react";
import ColorPlane from "./color-plane";
import Icon from "./icon";
import { useColorMemory } from "./color-memory";
import {
  hexToHsv,
  hsvToHex,
  normalizeColor,
  weddingColors,
  partyColors,
  type HSV,
} from "@/lib/ui/color";
export default function ColorPanel({
  id,
  value,
  onChange,
  onClose,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [hex, setHex] = useState(value),
    [invalid, setInvalid] = useState(false);
  const memory = useColorMemory();
  function update(next: HSV, commit = false) {
    const color = hsvToHex(next);
    setHsv(next);
    setHex(color);
    setInvalid(false);
    onChange(color);
    if (commit) memory.remember(color);
  }
  function choose(color: string) {
    setHsv(hexToHsv(color));
    setHex(color);
    setInvalid(false);
    onChange(color);
    memory.remember(color);
  }
  function applyHex() {
    const color = normalizeColor(hex);
    if (color) choose(color);
    else setInvalid(true);
  }
  function swatches(colors: string[], label: string) {
    return (
      <div className="color-palette">
        <strong>{label}</strong>
        <div className="color-swatches">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Usar ${color}`}
              aria-pressed={value === color}
              style={{ backgroundColor: color }}
              onClick={() => choose(color)}
            >
              {value === color && <Icon name="check" />}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div
      id={id}
      className="color-panel"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
          e.currentTarget.parentElement?.querySelector("button")?.focus();
        }
      }}
    >
      <div className="color-panel-heading">
        <strong>Tu paleta</strong>
        <button
          type="button"
          aria-label="Cerrar selector de color"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {swatches(weddingColors, "Elegancia natural")}
      {swatches(partyColors, "A todo color")}
      {memory.colors.length ? (
        swatches(memory.colors, "Tus colores recientes")
      ) : (
        <p className="color-memory-note">
          Los colores que uses aparecerán aquí.
        </p>
      )}
      <ColorPlane
        hsv={hsv}
        onChange={(next) => update(next)}
        onCommit={(next) => update(next, true)}
      />
      <div className="color-hex-row">
        <span style={{ backgroundColor: value }} />
        <label>
          HEX
          <input
            aria-label="Código hexadecimal"
            value={hex}
            maxLength={7}
            spellCheck={false}
            aria-invalid={invalid}
            onChange={(e) => {
              setHex(e.target.value);
              setInvalid(false);
            }}
            onBlur={applyHex}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyHex();
              }
            }}
          />
        </label>
        <button type="button" onClick={applyHex}>
          Aplicar
        </button>
      </div>
      {invalid && (
        <p role="alert" className="color-error">
          Escribe un color como #8150C7.
        </p>
      )}
      <small className="color-memory-note">
        Recientes guardados en este navegador, para tu cuenta.
      </small>
    </div>
  );
}
