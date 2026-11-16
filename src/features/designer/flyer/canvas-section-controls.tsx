import { useTranslator } from "@/lib/i18n/react";
import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import type { DesignSection } from "@/lib/events/types";
import type { FlyerCanvas } from "@/lib/events/flyer";
export default function CanvasSectionControls({
  sections,
  activeId,
  canvas,
  onSelect,
  onAdd,
  onChange,
  onBackground,
}: {
  sections: DesignSection[];
  activeId: string;
  canvas: FlyerCanvas;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onChange: (canvas: FlyerCanvas) => void;
  onBackground?: () => void;
}) {
  const i18n = useTranslator();

  const index = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );
  return (
    <section
      className="canvas-section-controls"
      aria-label={i18n("Sección y fondo")}
    >
      <span className="section-controls-label">{i18n("Estás editando")}</span>
      <div className="section-controls-row">
        <Listbox
          aria-label={i18n("Sección activa")}
          value={activeId}
          onValueChange={onSelect}
        >
          {sections.map((section, n) => (
            <option key={section.id} value={section.id}>
              {n + 1}. {section.heading || i18n("Sección sin título")}
            </option>
          ))}
        </Listbox>
        <button
          className="section-controls-add"
          aria-label={i18n("Añadir sección")}
          title={i18n("Añadir sección")}
          onClick={onAdd}
          disabled={sections.length >= 20}
        >
          <Icon name="plus" />
        </button>
      </div>
      <div className="section-controls-background" key={activeId}>
        <span>{i18n("Fondo de la sección")}</span>
        <ColorPicker
          label={i18n("Color de fondo de la sección {v0}", { v0: index + 1 })}
          value={canvas.background}
          onChange={(background) =>
            onChange({
              ...canvas,
              background,
              backgroundOverride: true,
              backgroundImage: undefined,
            })
          }
        />
      </div>
      {onBackground && (
        <button
          className="canvas-background-image-button"
          onClick={onBackground}
        >
          <Icon name="image" />
          {i18n("Imagen de fondo")}
        </button>
      )}
    </section>
  );
}
