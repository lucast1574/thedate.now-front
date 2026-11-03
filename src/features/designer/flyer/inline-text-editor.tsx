import { useRef, useState } from "react";
export default function InlineTextEditor({
  text,
  onCommit,
  onClose,
}: {
  text: string;
  onCommit: (text: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(text);
  const finished = useRef(false);
  function finish(cancel = false) {
    if (finished.current) return;
    finished.current = true;
    if (!cancel && value !== text) onCommit(value);
    onClose();
  }
  return (
    <textarea
      className="canvas-inline-text"
      aria-label="Editar texto en el lienzo"
      ref={(node) => {
        if (node && document.activeElement !== node) node.focus();
      }}
      value={value}
      maxLength={2000}
      onChange={(e) => setValue(e.target.value)}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onBlur={() => finish()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") {
          e.preventDefault();
          finish(true);
        }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          finish();
        }
      }}
    />
  );
}
