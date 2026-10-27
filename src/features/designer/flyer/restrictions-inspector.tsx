import Icon from "@/components/icon";
import FlyerRestrictions from "@/components/flyer-restrictions";
import type { FlyerElement } from "@/lib/events/flyer";
import { restrictionExamples } from "@/lib/events/restrictions";
import SymbolLibrary from "./symbol-library";
export default function RestrictionsInspector({
  item,
  onChange,
  kind,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
  kind?: "wedding" | "general";
}) {
  const style = item.restrictionStyle || "icon-text";
  return (
    <section className="restrictions-inspector">
      <div className="location-presentation">
        <h4>Cómo se muestra</h4>
        <div
          className="location-part-options"
          role="group"
          aria-label="Presentación de las restricciones"
        >
          {(
            [
              ["icon", "Icono", "lucide:shield-alert"],
              ["text", "Texto", "lucide:type"],
              ["icon-text", "Icono y texto", "lucide:layout-list"],
            ] as const
          ).map(([value, label, icon]) => (
            <button
              key={value}
              aria-pressed={style === value}
              onClick={() => onChange({ restrictionStyle: value })}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div
          className="location-mini-preview restriction-mini-preview"
          aria-label="Vista previa de las restricciones"
        >
          <FlyerRestrictions item={item} />
        </div>
      </div>
      <h4>Empieza con una idea</h4>
      <div className="restriction-examples">
        {restrictionExamples.map((example) => (
          <button
            key={example.label}
            onClick={() =>
              onChange({ text: example.text, restrictionIcon: example.icon })
            }
          >
            <Icon name={example.icon} />
            {example.label}
          </button>
        ))}
      </div>
      {style !== "icon" && (
        <label>
          Indicaciones para tus invitados
          <textarea
            rows={4}
            maxLength={2000}
            value={item.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
          />
        </label>
      )}
      {style !== "text" && (
        <details className="symbol-replace">
          <summary>Cambiar icono de restricciones</summary>
          <SymbolLibrary
            kind={kind}
            onPick={(restrictionIcon) => onChange({ restrictionIcon })}
          />
        </details>
      )}
      <p className="editor-hint">
        Puedes añadir varios avisos al canvas, cada uno con su propio icono y
        texto.
      </p>
    </section>
  );
}
