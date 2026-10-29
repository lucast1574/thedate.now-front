import Icon from "@/components/icon";
export default function EditorToggle({
  checked,
  onChange,
  title,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="editor-value-toggle"
      onClick={() => onChange(!checked)}
    >
      <span className="editor-value-toggle-mark" aria-hidden="true">
        {checked && <Icon name="check" />}
      </span>
      <span>
        {title}
        {hint && <small>{hint}</small>}
      </span>
    </button>
  );
}
