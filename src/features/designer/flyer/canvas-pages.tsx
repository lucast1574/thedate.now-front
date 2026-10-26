import CanvasFormatting from "./canvas-formatting";
import type { FlyerElement } from "@/lib/events/flyer";
import Icon from "@/components/icon";
import CanvasEditor from "./canvas-editor";
import { sectionCanvas } from "./canvas-model";
import type { useInvitationDesign } from "../use-invitation-design";
type Editor = ReturnType<typeof useInvitationDesign>;
export default function CanvasPages({
  editor,
  activeId,
  selectedId,
  onSelect,
  zoom,
  setZoom,
  addPage,
  selected,
  patch,
}: {
  editor: Editor;
  activeId: string;
  selectedId: string;
  onSelect: (page: string, element: string) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  addPage: () => void;
  selected?: FlyerElement;
  patch: (patch: Partial<FlyerElement>) => void;
}) {
  const { draft, sections } = editor;
  const photoURL = (key: string) =>
    `/api/photos/${draft.id}/${encodeURIComponent(key)}`;
  return (
    <section className="canvas-desk" aria-label="Lienzos de la invitación">
      <div className="canvas-context">
        <CanvasFormatting item={selected} onChange={patch} />
        <div>
          <button
            disabled={zoom <= 30}
            onClick={() => setZoom(zoom - 10)}
            aria-label="Alejar"
          >
            −
          </button>
          <output>{zoom}%</output>
          <button
            disabled={zoom >= 100}
            onClick={() => setZoom(zoom + 10)}
            aria-label="Acercar"
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
      <div className="canvas-scroll">
        <div
          className="canvas-page-stack"
          style={{ width: `${(720 * zoom) / 100}px` }}
        >
          {sections.map((section, n) => (
            <article
              key={section.id}
              id={`page-${section.id}`}
              className={`canvas-page ${activeId === section.id ? "is-active" : ""}`}
            >
              <header>
                <button
                  className="canvas-page-name"
                  onClick={() => {
                    onSelect(section.id, "");
                  }}
                >
                  {String(n + 1).padStart(2, "0")}{" "}
                  <span>{section.heading || "Sección sin título"}</span>
                </button>
                <div>
                  <button
                    disabled={n === 0}
                    aria-label={`Subir sección ${n + 1}`}
                    onClick={() => editor.moveSection(n, -1)}
                  >
                    <Icon name="down" style={{ transform: "rotate(180deg)" }} />
                  </button>
                  <button
                    disabled={n === sections.length - 1}
                    aria-label={`Bajar sección ${n + 1}`}
                    onClick={() => editor.moveSection(n, 1)}
                  >
                    <Icon name="down" />
                  </button>
                  <button
                    disabled={sections.length === 1}
                    aria-label={`Eliminar sección ${n + 1}`}
                    onClick={() => editor.removeSection(section.id)}
                  >
                    <Icon name="close" />
                  </button>
                </div>
              </header>
              <CanvasEditor
                canvas={sectionCanvas(section, draft)}
                selectedId={activeId === section.id ? selectedId : ""}
                onSelect={(id) => {
                  onSelect(section.id, id);
                }}
                onChange={(next) => editor.updateSection(n, { canvas: next })}
                photoURL={photoURL}
              />
              {!section.canvas?.elements.length && (
                <p className="canvas-empty-caption">
                  Tu lienzo en blanco. Añade algo desde Elementos.
                </p>
              )}
            </article>
          ))}
          <button
            className="canvas-add-page"
            disabled={sections.length >= 20}
            onClick={addPage}
          >
            <Icon name="plus" /> Añadir sección
          </button>
          <p className="canvas-stack-note">
            {sections.length} de 20 secciones · Se verán seguidas en tu
            invitación
          </p>
        </div>
      </div>
    </section>
  );
}
