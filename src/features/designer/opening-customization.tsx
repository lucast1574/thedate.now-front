import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const icon = opening.sealIcon || openingPreset(opening.style, i18n).icon;
  return (
    <>
      <section className="opening-palette-settings">
        <header>
          <strong>{i18n("Colores")}</strong>
          <span>{i18n("Se adaptan a tu diseño")}</span>
        </header>
        <div
          className="opening-palette-mode"
          role="group"
          aria-label={i18n("Origen de los colores")}
        >
          <button
            aria-pressed={opening.paletteMode === "design"}
            onClick={() => patch({ paletteMode: "design" })}
          >
            {i18n("Del diseño")}
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
            {i18n("Personalizados")}
          </button>
        </div>
        <div className="opening-palette-swatches">
          <span style={{ background: opening.color }} />
          <span style={{ background: opening.ink }} />
          <small>
            {opening.paletteMode === "design"
              ? i18n("Siguen la plantilla y los cambios del canvas.")
              : i18n("Conservan tus colores al cambiar de plantilla.")}
          </small>
        </div>
        {opening.paletteMode !== "design" && (
          <div className="opening-custom-colors">
            <label>
              {i18n("Fondo")}{" "}
              <ColorPicker
                label={i18n("Fondo de apertura")}
                value={opening.color}
                onChange={(color) => patch({ color })}
              />
            </label>
            <label>
              {i18n("Detalle y texto")}{" "}
              <ColorPicker
                label={i18n("Detalle y texto de apertura")}
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
            {i18n("Icono de la apertura")}{" "}
            <small>
              {opening.sealIcon
                ? i18n("Personalizado")
                : i18n("Incluido con este estilo")}
            </small>
          </span>
          {icon !== "none" && <Icon name={icon} />}
        </summary>
        <button onClick={() => patch({ sealIcon: "" })}>
          {i18n("Usar icono del estilo")}
        </button>
        <button onClick={() => patch({ sealIcon: "none" })}>
          {i18n("Sin icono")}
        </button>
        <SymbolLibrary kind={kind} onPick={(sealIcon) => patch({ sealIcon })} />
      </details>
      <details className="opening-custom-section">
        <summary>{i18n("Editar textos y letra")}</summary>
        <div className="opening-editor-fields">
          <label>
            {i18n("Título")}{" "}
            <input
              maxLength={160}
              placeholder={title}
              value={opening.title || ""}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </label>
          <label>
            {i18n("Mensaje")}{" "}
            <textarea
              maxLength={240}
              rows={3}
              value={opening.message}
              onChange={(e) => patch({ message: e.target.value })}
            />
          </label>
          <label>
            {i18n("Botón")}{" "}
            <input
              maxLength={60}
              value={opening.buttonLabel}
              onChange={(e) => patch({ buttonLabel: e.target.value })}
            />
          </label>
          <label>
            {i18n("Letra")}{" "}
            <Listbox
              value={opening.font || ""}
              onValueChange={(font) => patch({ font: font as Opening["font"] })}
              aria-label={i18n("Letra del título de apertura")}
            >
              <option value="">{i18n("Del estilo")}</option>
              <option value="serif">{i18n("Serif")}</option>
              <option value="sans">{i18n("Sans")}</option>
              <option value="script">{i18n("Manuscrita")}</option>
            </Listbox>
          </label>
        </div>
      </details>
    </>
  );
}
