import { useTranslator } from "@/lib/i18n/react";
import { useId } from "react";
import ColorPicker from "./color-picker";
import Icon from "./icon";
type Style = { template: string; accentColor: string };
type Props = Style & {
  classicLabel?: string;
  colorLabel?: string;
  onChange: (patch: Partial<Style>) => void;
};
export default function StyleFields({
  template,
  accentColor,
  onChange,
  classicLabel: sourceClassicLabel,
  colorLabel: sourceColorLabel,
}: Props) {
  const i18n = useTranslator();
  const classicLabel = sourceClassicLabel ?? i18n("Clásico");
  const colorLabel = sourceColorLabel ?? i18n("Color");

  const group = useId();
  return (
    <div className="style-fields">
      <fieldset className="style-options">
        <legend>{i18n("Estilo de tu invitación")}</legend>
        <div className="style-option-grid">
          {(
            [
              [
                "classic",
                classicLabel,
                i18n("Detalles delicados y una composición editorial."),
              ],
              [
                "modern",
                i18n("Moderno"),
                i18n("Tipografía con carácter y líneas contemporáneas."),
              ],
            ] as const
          ).map(([key, label, description]) => (
            <label className="style-option" key={key}>
              <input
                type="radio"
                name={group}
                value={key}
                checked={template === key}
                onChange={() => onChange({ template: key })}
              />
              <span className="style-option-body">
                <span
                  className={`style-sample style-sample-${key}`}
                  style={{ color: accentColor }}
                >
                  <Icon name={key === "classic" ? "flower" : "sparkle"} />
                  <span>{i18n("Aa")}</span>
                  <i />
                </span>
                <strong>{label}</strong>
                <small>{description}</small>
                <span className="style-check">
                  <Icon name="check" />
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="color-field">
        <span>{colorLabel}</span>
        <ColorPicker
          label={colorLabel}
          value={accentColor}
          onChange={(value) => onChange({ accentColor: value })}
        />
      </div>
    </div>
  );
}
