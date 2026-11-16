import { useTranslator } from "@/lib/i18n/react";
import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
import EditorToggle from "./editor-toggle";
export default function ActionHintInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  return (
    <details className="inspector-disclosure">
      <summary>{i18n("Pista para pulsar")}</summary>
      <div className="inspector-disclosure-body">
        <EditorToggle
          checked={!!item.actionHint}
          onChange={(actionHint) => onChange({ actionHint })}
          title={i18n("Mostrar una pista discreta")}
        />
        {item.actionHint && (
          <>
            <label>
              {i18n("Presentación")}{" "}
              <Listbox
                value={item.hintStyle || "icon-text"}
                onValueChange={(hintStyle) =>
                  onChange({
                    hintStyle: hintStyle as FlyerElement["hintStyle"],
                  })
                }
              >
                <option value="icon-text">{i18n("Icono y texto")}</option>
                <option value="text">{i18n("Solo texto")}</option>
                <option value="icon">{i18n("Solo icono")}</option>
              </Listbox>
            </label>
            <label>
              {i18n("Texto de la pista")}{" "}
              <input
                maxLength={80}
                value={item.hintText || ""}
                placeholder={
                  item.binding === "gift_link"
                    ? i18n("Ver regalos")
                    : i18n("Cómo llegar")
                }
                onChange={(e) => onChange({ hintText: e.target.value })}
              />
            </label>
            <label>
              {i18n("Icono")}{" "}
              <Listbox
                value={item.hintIcon || "external"}
                onValueChange={(hintIcon) => onChange({ hintIcon })}
              >
                <option value="external">{i18n("Abrir enlace")}</option>
                <option value="lucide:map-pin">{i18n("Ubicación")}</option>
                <option value="lucide:gift">{i18n("Regalo")}</option>
                <option value="arrow">{i18n("Flecha")}</option>
              </Listbox>
            </label>
            <small>
              {i18n(
                "El color, la alineación y el tamaño acompañan al elemento.",
              )}
            </small>
          </>
        )}
      </div>
    </details>
  );
}
