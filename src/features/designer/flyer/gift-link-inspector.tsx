import FlyerGiftLink from "@/components/flyer-gift-link";
import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";
export default function GiftLinkInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
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
          onChange={(e) => onChange({ text: e.target.value, link: "/regalos" })}
        />
      </label>
      <p className="editor-hint">
        <Icon name="lucide:gift" /> Conectado automáticamente a la lista de
        regalos de esta celebración. Añade tus productos desde Regalos; este
        elemento siempre abrirá la lista actualizada.
      </p>
      <p className="editor-hint">
        Puedes cambiar el texto, color, tipografía, tamaño y posición. No
        necesitas pegar ningún enlace ni activar la lista.
      </p>
    </section>
  );
}
