import ColorPicker from "@/components/color-picker";
import Icon from "@/components/icon";
import type { DesignSection } from "@/lib/events/types";
import type { FlyerCanvas } from "@/lib/events/flyer";
import type { useInvitationDesign } from "../use-invitation-design";
import { clamp, sectionCanvas } from "./canvas-model";

type Editor = ReturnType<typeof useInvitationDesign>;
export default function CanvasSectionPanel({
  editor,
  active,
  index,
  canvas,
  onSelect,
  onAdd,
  onChange,
}: {
  editor: Editor;
  active?: DesignSection;
  index: number;
  canvas: FlyerCanvas;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onChange: (canvas: FlyerCanvas) => void;
}) {
  return (
    <div className="canvas-section-panel">
      <p className="canvas-section-help">
        Elige una sección aquí o pulsa su fondo en el lienzo.
      </p>
      {active && (
        <div className="color-field canvas-section-background" key={active.id}>
          <span>Color de fondo · Sección {index + 1}</span>
          <ColorPicker
            label={`Color de fondo de la sección ${index + 1}`}
            value={canvas.background}
            onChange={(background) => onChange({ ...canvas, background })}
          />
          <small>Solo cambia el fondo de la sección seleccionada.</small>
        </div>
      )}
      <div className="canvas-section-list-heading">
        <h3>Tus secciones</h3>
        <span>{editor.sections.length} de 20</span>
      </div>
      <div className="canvas-page-list" aria-label="Seleccionar sección">
        {editor.sections.map((section, n) => (
          <button
            key={section.id}
            aria-pressed={section.id === active?.id}
            onClick={() => onSelect(section.id)}
          >
            <span
              className="canvas-section-swatch"
              style={{
                backgroundColor: sectionCanvas(section, editor.draft)
                  .background,
              }}
              aria-hidden="true"
            />
            <span className="canvas-section-caption">
              <strong>{section.heading || "Sección sin título"}</strong>
              <small>
                Sección {n + 1}
                {section.id === active?.id ? " · Seleccionada" : ""}
              </small>
            </span>
            {section.id === active?.id && <Icon name="check" />}
          </button>
        ))}
        <button
          className="canvas-section-add"
          disabled={editor.sections.length >= 20}
          onClick={onAdd}
        >
          <Icon name="plus" /> Añadir sección
        </button>
      </div>
      {active && (
        <details className="canvas-section-details">
          <summary>Opciones de la sección {index + 1}</summary>
          <label>
            Nombre de la sección
            <input
              value={active.heading}
              maxLength={120}
              onChange={(e) =>
                editor.updateSection(index, { heading: e.target.value })
              }
            />
          </label>
          <label>
            Altura del lienzo
            <input
              type="number"
              min={320}
              max={2000}
              step={40}
              value={canvas.height}
              onChange={(e) =>
                onChange({
                  ...canvas,
                  height: clamp(
                    Number(e.target.value),
                    Math.max(
                      320,
                      ...canvas.elements.map((el) => el.y + el.height),
                    ),
                    2000,
                  ),
                })
              }
            />
          </label>
        </details>
      )}
    </div>
  );
}
