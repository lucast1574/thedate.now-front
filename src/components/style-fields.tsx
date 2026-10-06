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
  classicLabel = "Clásico",
  colorLabel = "Color",
}: Props) {
  return (
    <div className="form-grid">
      <label>
        Estilo
        <select
          value={template}
          onChange={(e) => onChange({ template: e.target.value })}
        >
          <option value="classic">{classicLabel}</option>
          <option value="modern">Moderno</option>
        </select>
      </label>
      <label>
        {colorLabel}
        <input
          type="color"
          value={accentColor}
          onChange={(e) => onChange({ accentColor: e.target.value })}
        />
      </label>
    </div>
  );
}
