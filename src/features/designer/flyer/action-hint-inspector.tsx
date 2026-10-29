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
  return (
    <details className="inspector-disclosure">
      <summary>Pista para pulsar</summary>
      <div className="inspector-disclosure-body">
        <EditorToggle
          checked={!!item.actionHint}
          onChange={(actionHint) => onChange({ actionHint })}
          title="Mostrar una pista discreta"
        />
        {item.actionHint && (
          <>
            <label>
              Presentación
              <Listbox
                value={item.hintStyle || "icon-text"}
                onValueChange={(hintStyle) =>
                  onChange({
                    hintStyle: hintStyle as FlyerElement["hintStyle"],
                  })
                }
              >
                <option value="icon-text">Icono y texto</option>
                <option value="text">Solo texto</option>
                <option value="icon">Solo icono</option>
              </Listbox>
            </label>
            <label>
              Texto de la pista
              <input
                maxLength={80}
                value={item.hintText || ""}
                placeholder={
                  item.binding === "gift_link" ? "Ver regalos" : "Cómo llegar"
                }
                onChange={(e) => onChange({ hintText: e.target.value })}
              />
            </label>
            <label>
              Icono
              <Listbox
                value={item.hintIcon || "external"}
                onValueChange={(hintIcon) => onChange({ hintIcon })}
              >
                <option value="external">Abrir enlace</option>
                <option value="lucide:map-pin">Ubicación</option>
                <option value="lucide:gift">Regalo</option>
                <option value="arrow">Flecha</option>
              </Listbox>
            </label>
            <small>
              El color, la alineación y el tamaño acompañan al elemento.
            </small>
          </>
        )}
      </div>
    </details>
  );
}
