import { useEffect, useRef, useState } from "react";
import FlyerSurface from "@/components/flyer-surface";
import Icon from "@/components/icon";
import {
  invitationTemplates,
  type InvitationTemplate,
} from "@/lib/events/template-catalog";
import type { useInvitationDesign } from "./use-invitation-design";
import { templateCanvas } from "./template-canvas";
import { applyTemplateToSection } from "./templates";
import { blankCanvas } from "./flyer/canvas-model";
import TemplateDetail from "./template-detail";
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
    const populated = Boolean(section?.canvas?.elements.length);
    if (populated && !styleOnly) {
      if ((draft.sections?.length || 0) >= 20) return;
      const id = crypto.randomUUID();
      setDraft((current) =>
        applyTemplateToSection(
          {
            ...current,
            sections: [
              ...(current.sections || []),
              {
                id,
                heading: template.name,
                body: "",
                icon: "none",
                canvas: blankCanvas(current.accentColor),
              },
            ],
          },
          template,
          id,
        ),
      );
      onActivate(id);
      setMessage(
        `«${template.name}» añadido como nueva sección. Puedes deshacer el cambio.`,
      );
    } else {
      setDraft((current) =>
        applyTemplateToSection(current, template, sectionId),
      );
      setMessage(
        `Diseño aplicado a «${section?.heading || "tu sección"}». Puedes deshacer el cambio.`,
      );
      onActivate(sectionId);
    }
    setSelectedId("");
  }
  return (
    <div ref={panel} className="template-panel">
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
          canAdd={(draft.sections?.length || 0) < 20}
        />
      ) : (
        <>
          <p className="canvas-panel-description">
            {catalog.length} diseños para{" "}
            {draft.kind === "wedding"
              ? "contar vuestra historia"
              : "tu próxima celebración"}
            . Elige uno y hazlo tuyo.
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
                <span>{template.category}</span>
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
