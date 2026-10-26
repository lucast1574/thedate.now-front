import Icon from "@/components/icon";
import type { Kind } from "@/lib/events/types";
export default function CanvasRail({
  tab,
  kind,
  onChange,
}: {
  tab: string;
  kind: Kind;
  onChange: (tab: string) => void;
}) {
  return (
    <nav className="canvas-rail" aria-label="Herramientas de diseño">
      {[
        ["pages", "layout", "Secciones"],
        ["experience", "mail", "Entrada y detalles"],
        ["elements", "sparkle", "Elementos"],
        ["photos", "image", "Imágenes"],
        ["layers", "table", "Capas"],
        ["music", "music", "Música"],
        ["templates", "layout", "Plantillas"],
      ].map(([id, icon, label]) => (
        <button
          key={id}
          aria-pressed={tab === id}
          onClick={() => {
            onChange(id);
          }}
        >
          <Icon name={icon} />
          <span>{label}</span>
        </button>
      ))}
      <span className="canvas-rail-brand">
        {kind === "wedding" ? "Save the Date" : "the date."}
      </span>
    </nav>
  );
}
