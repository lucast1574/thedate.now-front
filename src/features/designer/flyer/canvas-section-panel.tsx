import { useTranslator } from "@/lib/i18n/react";
import SectionLibrary from "../section-library-panel";
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
  onOpening,
  onChange,
  onAdd,
}: {
  editor: Editor;
  active?: DesignSection;
  index: number;
  canvas: FlyerCanvas;
  onSelect: (id: string) => void;
  onOpening: () => void;
  onChange: (canvas: FlyerCanvas) => void;
  onAdd: () => void;
}) {
  const i18n = useTranslator();

  return (
    <div className="canvas-section-panel">
      <SectionLibrary editor={editor} onSelect={onSelect} />
      <p className="canvas-section-help">
        {i18n("Elige una sección aquí o pulsa su fondo en el lienzo.")}
      </p>
      <button className="opening-section-card" onClick={onOpening}>
        <Icon name="mail" />
        <span>
          <strong>
            {editor.draft.opening?.enabled
              ? i18n("Sobre de apertura")
              : i18n("Añadir una apertura")}
          </strong>
          <small>
            {i18n("Inicio de la invitación ·")}{" "}
            {editor.draft.opening?.enabled ? i18n("Editar") : i18n("Opcional")}
          </small>
        </span>
        <Icon name="chevron" />
      </button>
      <div className="canvas-section-list-heading">
        <h3>{i18n("Tus secciones")}</h3>
        <span>
          {editor.sections.length} {i18n("de 20")}
        </span>
      </div>
      <div
        className="canvas-page-list"
        aria-label={i18n("Seleccionar sección")}
      >
        {editor.sections.map((section, n) => (
          <button
            key={section.id}
            aria-pressed={section.id === active?.id}
            onClick={() => onSelect(section.id)}
          >
            <span
              className="canvas-section-swatch"
              style={{
                backgroundColor: sectionCanvas(section, editor.draft, i18n)
                  .background,
              }}
              aria-hidden="true"
            />
            <span className="canvas-section-caption">
              <strong>{section.heading || i18n("Sección sin título")}</strong>
              <small>
                {i18n("Sección")} {n + 1}
                {section.id === active?.id ? i18n(" · Seleccionada") : ""}
              </small>
            </span>
            {section.id === active?.id && <Icon name="check" />}
          </button>
        ))}
      </div>
      <button
        className="canvas-section-add"
        onClick={onAdd}
        disabled={editor.sections.length >= 20}
      >
        <Icon name="plus" />
        {i18n("Añadir sección")}
      </button>
      {active && (
        <details className="canvas-section-details">
          <summary>
            {i18n("Opciones de la sección")} {index + 1}
          </summary>
          <label>
            {i18n("Nombre de la sección")}{" "}
            <input
              value={active.heading}
              maxLength={120}
              onChange={(e) =>
                editor.updateSection(index, { heading: e.target.value })
              }
            />
          </label>
          <label>
            {i18n("Altura del lienzo")}{" "}
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
