import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import ColorPicker from "@/components/color-picker";
import type { FlyerElement } from "@/lib/events/flyer";
export default function DressColorRules({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  const colors = item.dressExcludedColors || [];
  function patch(index: number, value: Partial<(typeof colors)[number]>) {
    onChange({
      dressExcludedColors: colors.map((rule, n) =>
        n === index ? { ...rule, ...value } : rule,
      ),
    });
  }
  return (
    <section className="dress-color-settings">
      <header>
        <h4>{i18n("Colores no permitidos")}</h4>
        <span>{colors.length}/8</span>
      </header>
      <p>
        {i18n(
          "Se muestran en el dress code con su nombre y una muestra tachada.",
        )}
      </p>
      {colors.map((rule, index) => (
        <div className="dress-color-editor-row" key={index}>
          <ColorPicker
            label={i18n("Color no permitido {v0}", { v0: index + 1 })}
            value={rule.color}
            onChange={(color) => patch(index, { color })}
          />
          <label>
            <span className="sr-only">
              {i18n("Nombre del color")} {index + 1}
            </span>
            <input
              required
              maxLength={40}
              value={rule.name}
              placeholder={i18n("Nombre del color")}
              onChange={(e) => patch(index, { name: e.target.value })}
            />
          </label>
          <button
            type="button"
            aria-label={i18n("Quitar color {v0}", {
              v0: rule.name || index + 1,
            })}
            onClick={() =>
              onChange({
                dressExcludedColors: colors.filter((_, n) => n !== index),
              })
            }
          >
            <Icon name="close" />
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={colors.length >= 8}
        className="inspector-secondary-action"
        onClick={() =>
          onChange({
            dressExcludedColors: [
              ...colors,
              {
                name: colors.length ? i18n("Marfil") : i18n("Blanco"),
                color: colors.length ? "#F5EFE2" : "#FFFFFF",
              },
            ],
          })
        }
      >
        <Icon name="plus" /> {i18n("Añadir color no permitido")}
      </button>
    </section>
  );
}
