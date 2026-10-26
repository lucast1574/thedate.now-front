import Icon from "@/components/icon";
import Brand from "@/components/brand";
import type { Kind } from "@/lib/events/types";
const groups = [
  {
    label: "Diseñar",
    tools: [
      ["elements", "sparkle", "Elementos", "Añadir texto, fotos y elementos"],
      ["templates", "layout", "Plantillas", "Elegir una invitación completa"],
      ["photos", "image", "Imágenes", "Subir y añadir tus fotos"],
    ],
  },
  {
    label: "Organizar",
    tools: [
      [
        "pages",
        "lucide:panels-top-left",
        "Secciones",
        "Organizar las secciones de la invitación",
      ],
      ["layers", "table", "Capas", "Ordenar los elementos de la sección"],
    ],
  },
  {
    label: "Personalizar",
    tools: [
      [
        "experience",
        "lucide:sliders-horizontal",
        "Detalles",
        "Sobre de apertura, dress code y avisos",
      ],
      ["music", "music", "Música", "Elegir la música de la invitación"],
    ],
  },
];
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
      {groups.map((group) => (
        <div
          key={group.label}
          className="canvas-rail-group"
          role="group"
          aria-label={group.label}
        >
          {group.tools.map(([id, icon, label, description]) => (
            <button
              key={id}
              aria-pressed={tab === id}
              title={description}
              onClick={() => onChange(id)}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      ))}
      <span
        className="canvas-rail-brand"
        title={kind === "wedding" ? "Save the Date" : "The Date"}
      >
        <Brand wedding={kind === "wedding"} />
      </span>
    </nav>
  );
}
