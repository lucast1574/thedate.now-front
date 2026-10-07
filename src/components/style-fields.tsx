import Listbox from "@/components/listbox";
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
        <Listbox
          value={template}
          onValueChange={(value) => onChange({ template: value })}
        >
          <option value="classic">{classicLabel}</option>
          <option value="modern">Moderno</option>
        </Listbox>
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
