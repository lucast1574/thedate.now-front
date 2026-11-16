import { useTranslator } from "@/lib/i18n/react";
import PhotoPresentationFields from "./photo-presentation-fields";
import OrnamentAppearance from "./ornament-appearance";
import GiftLinkInspector from "./gift-link-inspector";
import { elementLabel } from "@/lib/events/element-label";
import ActionHintInspector from "./action-hint-inspector";
import MapInspector from "./map-inspector";
import EventBindingInspector from "./event-binding-inspector";
import EventTextInspector from "./event-text-inspector";
import DressCodeInspector from "./dress-code-inspector";
import RestrictionsInspector from "./restrictions-inspector";
import { dressParts } from "@/lib/events/dress-code";
import Icon from "@/components/icon";
import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import GuestBindingField from "./guest-binding-field";
import LocationInspector from "./location-inspector";
import ElementGeometryFields from "./element-geometry-fields";
import TextStyleFields from "./text-style-fields";
import SymbolLibrary from "./symbol-library";
export default function ElementInspector({
  item,
  photos,
  canvas,
  kind,
  onChange,
  onDuplicate,
  onRemove,
  onReplaceImage,
  photoURL = (key) => key,
}: {
  item: FlyerElement;
  photos: string[];
  canvas?: FlyerCanvas;
  kind?: "wedding" | "general";
  onChange: (patch: Partial<FlyerElement>) => void;
  onDuplicate?: () => void;
  onRemove: () => void;
  onReplaceImage?: () => void;
  photoURL?: (key: string) => string;
  onLayer?: (direction: number) => void;
}) {
  const i18n = useTranslator();

  const title = elementLabel(item, i18n);
  return (
    <section className="element-inspector">
      <header className="inspector-heading">
        <div>
          <h3>{title}</h3>
          <p>
            {item.binding === "guest_name"
              ? i18n("Personalizado para cada invitado")
              : item.binding === "location"
                ? i18n("Un acceso al lugar de tu celebración")
                : item.type === "image"
                  ? i18n("Integra tu foto con el estilo de la invitación")
                  : item.type === "icon"
                    ? i18n("Un detalle para tu invitación")
                    : i18n("Dale voz a tu invitación")}
          </p>
        </div>
        <div className="inspector-quick-actions">
          {onDuplicate && (
            <button
              title={i18n("Duplicar elemento")}
              aria-label={i18n("Duplicar elemento")}
              onClick={onDuplicate}
            >
              <Icon name="lucide:copy" />
            </button>
          )}
          <button
            title={i18n("Eliminar elemento")}
            aria-label={i18n("Eliminar elemento")}
            onClick={onRemove}
          >
            <Icon name="lucide:trash" />
          </button>
        </div>
      </header>
      {item.type === "image" && (
        <PhotoPresentationFields item={item} onChange={onChange} />
      )}
      <OrnamentAppearance item={item} onChange={onChange} />
      <EventBindingInspector item={item} onChange={onChange} />
      {["couple_names", "event_title", "event_date"].includes(
        item.binding || "",
      ) ? (
        <EventTextInspector item={item} onChange={onChange} />
      ) : item.binding === "map" ? (
        <MapInspector key={item.id} item={item} onChange={onChange} />
      ) : item.binding === "guest_name" ? (
        <GuestBindingField
          text={item.text || ""}
          onChange={(text) => onChange({ text })}
        />
      ) : item.binding === "gift_link" ? (
        <GiftLinkInspector key={item.id} item={item} onChange={onChange} />
      ) : item.binding === "dress_code" ? (
        <DressCodeInspector
          item={item}
          photos={photos}
          onChange={onChange}
          onReplace={onReplaceImage}
          photoURL={photoURL}
        />
      ) : item.binding === "restrictions" ? (
        <RestrictionsInspector item={item} onChange={onChange} kind={kind} />
      ) : item.binding === "location" ? (
        <LocationInspector key={item.id} item={item} onChange={onChange} />
      ) : (
        item.type === "text" && (
          <label>
            {i18n("Contenido · también con doble clic en el lienzo")}{" "}
            <textarea
              rows={3}
              maxLength={2000}
              value={item.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
            />
          </label>
        )
      )}
      {["location", "gift_link", "map"].includes(item.binding || "") && (
        <ActionHintInspector item={item} onChange={onChange} />
      )}
      {item.type === "image" ? (
        <>
          <label>
            {i18n("Reemplazar imagen")}{" "}
            <Listbox
              value={item.photoKey}
              onValueChange={(photoKey) => onChange({ photoKey })}
            >
              {photos.map((key, n) => (
                <option key={key} value={key}>
                  {i18n("Imagen")} {n + 1}
                </option>
              ))}
            </Listbox>
          </label>
        </>
      ) : (
        <>
          {item.type === "icon" && (
            <details className="symbol-replace">
              <summary>{i18n("Cambiar símbolo")}</summary>
              <SymbolLibrary
                kind={kind}
                onPick={(icon) => onChange({ icon })}
              />
            </details>
          )}
          <details
            className="inspector-disclosure"
            open={item.binding !== "location" || undefined}
            key={`style-${item.id}`}
          >
            <summary>
              <Icon name="lucide:palette" />
              <span>{i18n("Estilo")}</span>
              <Icon name="chevron" />
            </summary>
            <div className="inspector-disclosure-body">
              <div className="color-field">
                <span>{i18n("Color")}</span>
                <ColorPicker
                  value={item.color}
                  onChange={(color) => onChange({ color })}
                />
              </div>
              {item.type === "text" &&
                item.restrictionStyle !== "icon" &&
                item.locationStyle !== "icon" &&
                (item.binding !== "dress_code" ||
                  dressParts(item.dressStyle).includes("text")) && (
                  <TextStyleFields item={item} onChange={onChange} />
                )}
            </div>
          </details>
        </>
      )}
      <ElementGeometryFields item={item} canvas={canvas} onChange={onChange} />
    </section>
  );
}
