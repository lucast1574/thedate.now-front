import Icon from "@/components/icon";
import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import type { Opening } from "@/lib/events/celebration";
import type { Kind } from "@/lib/events/types";
import { openingPreset } from "@/lib/events/opening-presets";
import SymbolLibrary from "./flyer/symbol-library";
export default function OpeningCustomization({
  opening,
  kind,
  title,
  patch,
}: {
  opening: Opening;
  kind: Kind;
  title: string;
  patch: (value: Partial<Opening>) => void;
}) {
  const icon = opening.sealIcon || openingPreset(opening.style).icon;
  return (
    <>
      <section className="opening-palette-settings">
        <header>
          <strong>Colores</strong>
          <span>Se adaptan a tu diseño</span>
        </header>
        <div
          className="opening-palette-mode"
          role="group"
          aria-label="Origen de los colores"
        >
          <button
            aria-pressed={opening.paletteMode === "design"}
            onClick={() => patch({ paletteMode: "design" })}
          >
            Del diseño
          </button>
          <button
            aria-pressed={opening.paletteMode !== "design"}
            onClick={() =>
              patch({
                paletteMode: "custom",
                color: opening.color,
                ink: opening.ink,
              })
            }
          >
            Personalizados
          </button>
        </div>
        <div className="opening-palette-swatches">
          <span style={{ background: opening.color }} />
          <span style={{ background: opening.ink }} />
          <small>
            {opening.paletteMode === "design"
              ? "Siguen la plantilla y los cambios del canvas."
              : "Conservan tus colores al cambiar de plantilla."}
          </small>
        </div>
        {opening.paletteMode !== "design" && (
          <div className="opening-custom-colors">
            <label>
              Fondo
              <ColorPicker
                label="Fondo de apertura"
                value={opening.color}
                onChange={(color) => patch({ color })}
              />
            </label>
            <label>
              Detalle y texto
              <ColorPicker
                label="Detalle y texto de apertura"
                value={opening.ink}
                onChange={(ink) => patch({ ink })}
              />
            </label>
          </div>
        )}
      </section>
      <details className="opening-custom-section">
        <summary>
          <span>
            Icono de la apertura
            <small>
              {opening.sealIcon ? "Personalizado" : "Incluido con este estilo"}
            </small>
          </span>
          {icon !== "none" && <Icon name={icon} />}
        </summary>
        <button onClick={() => patch({ sealIcon: "" })}>
          Usar icono del estilo
        </button>
        <button onClick={() => patch({ sealIcon: "none" })}>Sin icono</button>
        <SymbolLibrary kind={kind} onPick={(sealIcon) => patch({ sealIcon })} />
      </details>
      <details className="opening-custom-section">
        <summary>Editar textos y letra</summary>
        <div className="opening-editor-fields">
          <label>
            Título
            <input
              maxLength={160}
              placeholder={title}
              value={opening.title || ""}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </label>
          <label>
            Mensaje
            <textarea
              maxLength={240}
              rows={3}
              value={opening.message}
              onChange={(e) => patch({ message: e.target.value })}
            />
          </label>
          <label>
            Botón
            <input
              maxLength={60}
              value={opening.buttonLabel}
              onChange={(e) => patch({ buttonLabel: e.target.value })}
            />
          </label>
          <label>
            Letra
            <Listbox
              value={opening.font || ""}
              onValueChange={(font) => patch({ font: font as Opening["font"] })}
              aria-label="Letra del título de apertura"
            >
              <option value="">Del estilo</option>
              <option value="serif">Serif</option>
              <option value="sans">Sans</option>
              <option value="script">Manuscrita</option>
            </Listbox>
          </label>
        </div>
      </details>
    </>
  );
}
