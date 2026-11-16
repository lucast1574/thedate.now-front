import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const [query, setQuery] = useState("");
  const [all, setAll] = useState(false);
  const family = canvas.art || "editorial";
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const matches = ornaments(i18n).filter(
    (item) =>
      (all || query || item.family === family) &&
      normalize(`${item.name} ${ornamentFamilies(i18n)[item.family]}`).includes(
        normalize(query),
      ),
  );
  return (
    <section
      className="ornament-library"
      aria-label={i18n("Colecciones de adornos")}
    >
      <header>
        <h3>{i18n("Adornos de colección")}</h3>
        <p>
          {ornamentFamilies(i18n)[family]}
          {i18n(". Cada pieza se puede mover, girar y recolorear.")}
        </p>
      </header>
      <label className="ornament-search">
        <Icon name="search" />
        <input
          aria-label={i18n("Buscar adornos")}
          placeholder={i18n("Olivo, seda, olas…")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="ornament-tabs">
        <button type="button" aria-pressed={!all} onClick={() => setAll(false)}>
          {i18n("Para este diseño")}
        </button>
        <button type="button" aria-pressed={all} onClick={() => setAll(true)}>
          {i18n("Colecciones")}
        </button>
      </div>
      <div className="ornament-grid">
        {matches.map((item) => (
          <button
            type="button"
            key={item.id}
            disabled={disabled}
            aria-label={i18n("Añadir {v0}", { v0: item.name })}
            onClick={() =>
              onAdd(
                element(
                  "icon",
                  {
                    icon: `art:${item.id}`,
                    width: 180,
                    height: 180,
                    x: (canvas.width - 180) / 2,
                    y: (canvas.height - 180) / 2,
                  },
                  i18n,
                ),
              )
            }
          >
            <Icon name={`art:${item.id}`} />
            <strong>{item.name}</strong>
            <small>{ornamentFamilies(i18n)[item.family]}</small>
          </button>
        ))}
      </div>
      {!matches.length && (
        <p>{i18n("No encontramos ese adorno. Prueba con otra colección.")}</p>
      )}
    </section>
  );
}
