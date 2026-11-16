import { useTranslator } from "@/lib/i18n/react";
import DressPalettePicker from "./dress-palette-picker";
import Icon from "@/components/icon";
import Listbox from "@/components/listbox";
import FlyerDressCode from "@/components/flyer-dress-code";
import {
  dressParts,
  toggleDressPart,
  type DressPart,
} from "@/lib/events/dress-code";
import type { FlyerElement } from "@/lib/events/flyer";
import SymbolLibrary from "./symbol-library";
import DressColorRules from "./dress-color-rules";
export default function DressCodeInspector({
  item,
  photos,
  onChange,
  onReplace,
  photoURL,
}: {
  item: FlyerElement;
  photos: string[];
  onChange: (patch: Partial<FlyerElement>) => void;
  onReplace?: () => void;
  photoURL: (key: string) => string;
}) {
  const i18n = useTranslator();

  const parts = dressParts(item.dressStyle);
  function toggle(part: DressPart) {
    const dressStyle = toggleDressPart(item.dressStyle, part);
    if (dressStyle === item.dressStyle) return;
    const next = dressParts(dressStyle);
    onChange({
      dressStyle,
      width:
        dressStyle === "icon"
          ? 96
          : item.dressStyle === "icon"
            ? 400
            : item.width,
      height: next.includes("image")
        ? next.includes("text")
          ? 360
          : 260
        : next.includes("text")
          ? 220
          : 100,
    });
  }
  return (
    <section className="dress-code-inspector">
      <div className="location-presentation">
        <h4>{i18n("Elementos visibles")}</h4>
        <p>{i18n("Combina icono, imagen y texto, como en Ubicación.")}</p>
        <div
          className="location-part-options"
          role="group"
          aria-label={i18n("Elementos del dress code")}
        >
          {(
            [
              ["icon", i18n("Icono"), "lucide:shirt"],
              ["image", i18n("Imagen"), "image"],
              ["text", i18n("Texto"), "lucide:type"],
            ] as const
          ).map(([part, label, icon]) => (
            <button
              key={part}
              aria-pressed={parts.includes(part)}
              onClick={() => toggle(part)}
            >
              <Icon name={icon} />
              <span>{label}</span>
              <span className="location-part-check">
                <Icon name="check" />
              </span>
            </button>
          ))}
        </div>
        <div
          className="location-mini-preview dress-mini-preview"
          aria-label={i18n("Vista previa del dress code")}
        >
          <FlyerDressCode item={item} photoURL={photoURL} />
        </div>
      </div>
      {parts.includes("text") && (
        <label>
          {i18n("Texto de vestimenta")}{" "}
          <textarea
            rows={3}
            maxLength={2000}
            value={item.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
          />
        </label>
      )}
      {parts.includes("icon") && (
        <details className="symbol-replace">
          <summary>{i18n("Cambiar icono de vestimenta")}</summary>
          <SymbolLibrary onPick={(dressIcon) => onChange({ dressIcon })} />
        </details>
      )}
      <DressPalettePicker item={item} onChange={onChange} />
      <DressColorRules item={item} onChange={onChange} />
      {parts.includes("image") && (
        <>
          <label>
            {i18n("Imagen de vestimenta")}{" "}
            <Listbox
              aria-label={i18n("Imagen de vestimenta")}
              value={item.dressPhotoKey || "template-photo"}
              onValueChange={(dressPhotoKey) => onChange({ dressPhotoKey })}
            >
              <option value="template-photo">{i18n("Pon tu foto aquí")}</option>
              {photos.map((key, n) => (
                <option key={key} value={key}>
                  {i18n("Imagen")} {n + 1}
                </option>
              ))}
            </Listbox>
          </label>
          {onReplace && (
            <button className="inspector-secondary-action" onClick={onReplace}>
              <Icon name="image" /> {i18n("Subir imagen de vestimenta")}
            </button>
          )}
        </>
      )}
    </section>
  );
}
