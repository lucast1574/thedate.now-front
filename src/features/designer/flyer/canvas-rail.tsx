import Icon from "@/components/icon";
import Brand from "@/components/brand";
import type { Kind } from "@/lib/events/types";
import { canvasToolGroups } from "./canvas-tools";
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
      {canvasToolGroups.map((group) => (
        <div
          key={group.label}
          className="canvas-rail-group"
          role="group"
          aria-label={group.label}
        >
          <span className="canvas-rail-group-label" aria-hidden="true">
            {group.label}
          </span>
          {group.tools.map(({ id, icon, label, description }) => (
            <button
              key={id}
              aria-pressed={tab === id}
              title={description}
              aria-controls="canvas-tools"
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
