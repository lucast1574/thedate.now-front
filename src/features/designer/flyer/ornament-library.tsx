import { useState } from "react";
import Icon from "@/components/icon";
import { ornaments, ornamentFamilies } from "@/lib/events/ornaments";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { element } from "./canvas-model";
export default function OrnamentLibrary({
  canvas,
  disabled,
  onAdd,
}: {
  canvas: FlyerCanvas;
  disabled: boolean;
  onAdd: (item: FlyerElement) => void;
}) {
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(false);
  const family = canvas.art || "editorial";
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const matches = ornaments.filter(
    (item) =>
      (all || query || item.family === family) &&
      normalize(`${item.name} ${ornamentFamilies[item.family]}`).includes(
        normalize(query),
      ),
  );
  return (
    <section className="ornament-library" aria-label="Colecciones de adornos">
      <header>
        <h3>Adornos de colección</h3>
        <p>
          {ornamentFamilies[family]}. Cada pieza se puede mover, girar y
          recolorear.
        </p>
      </header>
      <label className="ornament-search">
        <Icon name="search" />
        <input
          aria-label="Buscar adornos"
          placeholder="Olivo, seda, olas…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="ornament-tabs">
        <button type="button" aria-pressed={!all} onClick={() => setAll(false)}>
          Para este diseño
        </button>
        <button type="button" aria-pressed={all} onClick={() => setAll(true)}>
          Colecciones
        </button>
      </div>
      <div className="ornament-grid">
        {matches.map((item) => (
          <button
            type="button"
            key={item.id}
            disabled={disabled}
            aria-label={`Añadir ${item.name}`}
            onClick={() =>
              onAdd(
                element("icon", {
                  icon: `art:${item.id}`,
                  width: 180,
                  height: 180,
                  x: (canvas.width - 180) / 2,
                  y: (canvas.height - 180) / 2,
                }),
              )
            }
          >
            <Icon name={`art:${item.id}`} />
            <strong>{item.name}</strong>
            <small>{ornamentFamilies[item.family]}</small>
          </button>
        ))}
      </div>
      {!matches.length && (
        <p>No encontramos ese adorno. Prueba con otra colección.</p>
      )}
    </section>
  );
}
