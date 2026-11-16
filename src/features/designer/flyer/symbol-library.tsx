import { useTranslator } from "@/lib/i18n/react";
import { useState } from "react";
import Icon from "@/components/icon";
import {
  allSymbols,
  weddingSymbols,
  eventSymbols,
  symbolLabel,
  symbolMatches,
} from "@/lib/events/symbols";
export default function SymbolLibrary({
  kind = "wedding",
  disabled = false,
  onPick,
}: {
  kind?: "wedding" | "general";
  disabled?: boolean;
  onPick: (icon: string) => void;
}) {
  const i18n = useTranslator();

  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("featured");
  const [limit, setLimit] = useState(60);
  const featured = kind === "wedding" ? weddingSymbols : eventSymbols;
  const search = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const source = search || group === "all" ? allSymbols : featured;
  const matches = source.filter((id) => !search || symbolMatches(id, search));
  return (
    <section
      className="symbol-library"
      aria-label={i18n("Biblioteca de símbolos")}
    >
      <label className="symbol-search">
        <Icon name="search" />
        <input
          aria-label={i18n("Buscar símbolos")}
          placeholder={
            kind === "general"
              ? i18n("Globos, regalos, música…")
              : i18n("Flores, corazones, música…")
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(60);
          }}
        />
      </label>
      <div className="symbol-categories">
        <button
          aria-pressed={group === "featured" && !search}
          onClick={() => {
            setGroup("featured");
            setQuery("");
            setLimit(60);
          }}
        >
          {kind === "wedding" ? i18n("Para tu boda") : i18n("Para tu evento")}
        </button>
        <button
          aria-pressed={group === "all" || !!search}
          onClick={() => {
            setGroup("all");
            setLimit(60);
          }}
        >
          {i18n("Todos ·")} {allSymbols.length}
        </button>
      </div>
      <div className="symbol-library-grid">
        {matches.slice(0, limit).map((id) => (
          <button
            key={id}
            disabled={disabled}
            title={i18n(symbolLabel(id))}
            aria-label={i18n("Añadir {v0}", { v0: i18n(symbolLabel(id)) })}
            onClick={() => onPick(id)}
          >
            <Icon name={id} />
          </button>
        ))}
      </div>
      {!matches.length && (
        <p>
          {i18n(
            "No encontramos símbolos. Prueba otro nombre, también en inglés.",
          )}
        </p>
      )}
      {matches.length > limit && (
        <button className="symbol-more" onClick={() => setLimit(limit + 60)}>
          {i18n("Ver más símbolos (")}
          {matches.length - limit})
        </button>
      )}
    </section>
  );
}
