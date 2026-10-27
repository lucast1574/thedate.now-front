import Listbox from "@/components/listbox";
import FlyerGiftLink from "@/components/flyer-gift-link";
import { validGiftLink } from "@/lib/events/gift-link";
import type { FlyerElement } from "@/lib/events/flyer";
export default function GiftLinkInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const internal = item.link === "/regalos";
  const invalid = !validGiftLink(item.link || "");
  return (
    <section className="gift-link-inspector">
      <div
        className="location-mini-preview"
        onClickCapture={(e) => e.preventDefault()}
      >
        <FlyerGiftLink item={item} />
      </div>
      <label>
        Texto del enlace
        <input
          maxLength={120}
          value={item.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>
      <label>
        Destino de la lista
        <Listbox
          aria-label="Destino de la lista de regalos"
          value={internal ? "event" : "external"}
          onValueChange={(value) =>
            onChange({ link: value === "event" ? "/regalos" : "" })
          }
        >
          <option value="event">Lista de este evento</option>
          <option value="external">Enlace de otra tienda</option>
        </Listbox>
      </label>
      {internal ? (
        <p className="editor-hint">
          Configura tus productos en Lista de regalos, dentro de la organización
          del evento. Cada invitado accederá con su enlace personal.
        </p>
      ) : (
        <label>
          Enlace de la lista de regalos
          <input
            type="url"
            maxLength={2048}
            placeholder="https://…"
            value={item.link || ""}
            aria-invalid={invalid}
            onChange={(e) => onChange({ link: e.target.value.trim() })}
          />
          {invalid && (
            <small>
              Introduce el enlace completo de tu lista, empezando por https://.
            </small>
          )}
        </label>
      )}
      <p className="editor-hint">
        Puedes mover, cambiar el color y editar este elemento como cualquier
        texto del diseño.
      </p>
    </section>
  );
}
