import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const style = item.restrictionStyle || "icon-text";
  return (
    <section className="restrictions-inspector">
      <div className="location-presentation">
        <h4>{i18n("Cómo se muestra")}</h4>
        <div
          className="location-part-options"
          role="group"
          aria-label={i18n("Presentación de las restricciones")}
        >
          {(
            [
              ["icon", i18n("Icono"), "lucide:shield-alert"],
              ["text", i18n("Texto"), "lucide:type"],
              ["icon-text", i18n("Icono y texto"), "lucide:layout-list"],
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
          aria-label={i18n("Vista previa de las restricciones")}
        >
          <FlyerRestrictions item={item} />
        </div>
      </div>
      <h4>{i18n("Empieza con una idea")}</h4>
      <div className="restriction-examples">
        {restrictionExamples(i18n).map((example) => (
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
          {i18n("Indicaciones para tus invitados")}{" "}
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
          <summary>{i18n("Cambiar icono de restricciones")}</summary>
          <SymbolLibrary
            kind={kind}
            onPick={(restrictionIcon) => onChange({ restrictionIcon })}
          />
        </details>
      )}
      <p className="editor-hint">
        {i18n(
          "Puedes añadir varios avisos al canvas, cada uno con su propio icono y texto.",
        )}
      </p>
    </section>
  );
}
