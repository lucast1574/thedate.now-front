import TemplatePanelCard from "./template-panel-card";
import { useTranslator } from "@/lib/i18n/react";
import InvitationThemePanel from "./invitation-theme-panel";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icon";
import {
  invitationTemplates,
  type InvitationTemplate,
} from "@/lib/events/template-catalog";
import type { useInvitationDesign } from "./use-invitation-design";
import { applyTemplate } from "./templates";
import { applyCompleteTemplate } from "./apply-template-design";
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
  const i18n = useTranslator();

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
  const catalog = invitationTemplates(i18n).filter(
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
  function apply(
    template: InvitationTemplate,
    styleOnly = false,
    photos = true,
  ) {
    const next = styleOnly
      ? applyTemplate(draft, template, i18n)
      : applyCompleteTemplate(draft, template, photos, i18n);
    setDraft(next);
    if (next.sections?.[0]) onActivate(next.sections[0].id);
    setMessage(
      styleOnly
        ? i18n("Colores y tipografía actualizados. Puedes deshacer.")
        : i18n(
            "Plantilla aplicada sin bloques del diseño anterior. Puedes deshacer.",
          ),
    );
    // The generated section IDs are owned by the new draft; activate after render.
    setSelectedId("");
  }
  return (
    <div ref={panel} className="template-panel">
      <InvitationThemePanel editor={editor} />
      {draft.sections?.length ? (
        <button
          className="template-style-only"
          onClick={() => {
            const template =
              catalog.find((t) => t.id === draft.templateId) || catalog[0];
            const next = addMissingTemplateElements(draft, template, i18n);
            setDraft(next);
            setMessage(
              next.sections!.length > draft.sections!.length
                ? i18n(
                    "Elementos añadidos en nuevas secciones. Tu diseño se conserva; puedes deshacer.",
                  )
                : i18n(
                    "Ya tienes los elementos o llegaste al máximo de secciones.",
                  ),
            );
          }}
        >
          {i18n("Añadir elementos que faltan")}
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
          onApply={(photos) => apply(selected, false, photos)}
          onStyle={() => apply(selected, true)}
          canAdd={true}
        />
      ) : (
        <>
          <p className="canvas-panel-description">
            {catalog.length} {i18n("diseños para")}{" "}
            {draft.kind === "wedding"
              ? i18n("contar vuestra historia")
              : i18n("tu próxima celebración")}
            {i18n(". Invitaciones completas listas para editar.")}
          </p>
          <label className="template-search">
            <Icon name="search" />
            <input
              aria-label={i18n("Buscar plantillas")}
              placeholder={i18n("Buscar un diseño o estilo")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div
            className="template-filters"
            aria-label={i18n("Filtrar plantillas por estilo")}
          >
            {categories.map((name) => (
              <button
                type="button"
                key={i18n(name)}
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                {i18n(name)}
              </button>
            ))}
          </div>
          <div className="template-panel-count">
            <span>
              {templates.length}{" "}
              {templates.length === 1 ? i18n("diseño") : i18n("diseños")}
            </span>
            <span>{i18n("Elementos editables")}</span>
          </div>
          <div className="template-panel-grid">
            {templates.map((template) => (
              <TemplatePanelCard
                key={template.id}
                template={template}
                onSelect={setSelectedId}
              />
            ))}
          </div>
          {!templates.length && (
            <div className="template-panel-empty">
              <h3>{i18n("No encontramos ese estilo")}</h3>
              <p>
                {i18n(
                  "Prueba con otro nombre o vuelve a ver todos los diseños.",
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("Todas");
                }}
              >
                {i18n("Ver todas las plantillas")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
