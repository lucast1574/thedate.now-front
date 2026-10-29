import { useEffect, useRef, useState } from "react";
import FlyerSurface from "@/components/flyer-surface";
import Icon from "@/components/icon";
import {
  invitationTemplates,
  type InvitationTemplate,
} from "@/lib/events/template-catalog";
import type { useInvitationDesign } from "./use-invitation-design";
import { templateCanvas } from "./template-canvas";
import { applyTemplate } from "./templates";
import { applyCompleteTemplate, templateSequence } from "./template-sequence";
import TemplateDetail from "./template-detail";
import { addMissingTemplateElements } from "./missing-template-elements";
import { useTemplateNavigation } from "./use-template-navigation";
const searchable = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
export default function TemplatePanel({
  editor,
  sectionId,
  onActivate,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
  sectionId: string;
  onActivate: (id: string) => void;
}) {
  const { draft, setDraft } = editor;
  const panel = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  useTemplateNavigation(panel, selectedId);
  const catalog = invitationTemplates.filter(
    (item) => item.kind === draft.kind && item.mode === "flyer",
  );
  const categories = [
    "Todas",
    ...new Set(catalog.map((item) => item.category || "Otros")),
  ];
  const templates = catalog.filter(
    (item) =>
      (category === "Todas" || item.category === category) &&
      searchable(`${item.name} ${item.tagline} ${item.category}`).includes(
        searchable(query),
      ),
  );
  const selected = catalog.find((item) => item.id === selectedId);
  const section = draft.sections?.find((item) => item.id === sectionId);
  function apply(template: InvitationTemplate, styleOnly = false) {
    const next = styleOnly
      ? applyTemplate(draft, template)
      : applyCompleteTemplate(draft, template);
    setDraft(next);
    if (next.sections?.[0]) onActivate(next.sections[0].id);
    setMessage(
      styleOnly
        ? "Colores y tipografía actualizados. Puedes deshacer."
        : "Invitación completa lista: cambia textos y pulsa las fotos para reemplazarlas. Puedes deshacer.",
    );
    // The generated section IDs are owned by the new draft; activate after render.
    setSelectedId("");
  }
  return (
    <div ref={panel} className="template-panel">
      {draft.sections?.length ? (
        <button
          className="template-style-only"
          onClick={() => {
            const template =
              catalog.find((t) => t.id === draft.templateId) || catalog[0];
            const next = addMissingTemplateElements(draft, template);
            setDraft(next);
            setMessage(
              next.sections!.length > draft.sections!.length
                ? "Elementos añadidos en nuevas secciones. Tu diseño se conserva; puedes deshacer."
                : "Ya tienes los elementos o llegaste al máximo de secciones.",
            );
          }}
        >
          Añadir elementos que faltan
        </button>
      ) : null}
      {message && (
        <p className="template-panel-feedback" role="status">
          <Icon name="check" />
          {message}
        </p>
      )}
      {selected ? (
        <TemplateDetail
          template={selected}
          draft={draft}
          section={section}
          onBack={() => setSelectedId("")}
          onApply={() => apply(selected)}
          onStyle={() => apply(selected, true)}
          canAdd={true}
        />
      ) : (
        <>
          <p className="canvas-panel-description">
            {catalog.length} diseños para{" "}
            {draft.kind === "wedding"
              ? "contar vuestra historia"
              : "tu próxima celebración"}
            . Invitaciones completas listas para editar.
          </p>
          <label className="template-search">
            <Icon name="search" />
            <input
              aria-label="Buscar plantillas"
              placeholder="Buscar un diseño o estilo"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div
            className="template-filters"
            aria-label="Filtrar plantillas por estilo"
          >
            {categories.map((name) => (
              <button
                type="button"
                key={name}
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="template-panel-count">
            <span>
              {templates.length} {templates.length === 1 ? "diseño" : "diseños"}
            </span>
            <span>Elementos editables</span>
          </div>
          <div className="template-panel-grid">
            {templates.map((template) => (
              <button
                type="button"
                className="template-panel-card"
                key={template.id}
                data-template-id={template.id}
                onClick={() => setSelectedId(template.id)}
                aria-label={`Ver diseño ${template.name}`}
              >
                <div className="template-panel-art">
                  <FlyerSurface
                    canvas={templateCanvas(template)}
                    photoURL={() => ""}
                    label={template.name}
                  />
                </div>
                <strong>{template.name}</strong>
                <span>
                  {templateSequence(template).length} secciones ·{" "}
                  {template.category}
                </span>
              </button>
            ))}
          </div>
          {!templates.length && (
            <div className="template-panel-empty">
              <h3>No encontramos ese estilo</h3>
              <p>Prueba con otro nombre o vuelve a ver todos los diseños.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("Todas");
                }}
              >
                Ver todas las plantillas
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
