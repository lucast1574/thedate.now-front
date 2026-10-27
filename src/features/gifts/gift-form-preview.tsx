import { giftStore } from "@/lib/events/gift-store";
import type { Gift } from "@/lib/events/wishlist";
import GiftImage from "./gift-image";
export default function GiftFormPreview({ gift }: { gift: Gift }) {
  return (
    <aside className="gift-form-preview" aria-label="Vista previa del producto">
      <span className="gift-preview-label">Así se verá el regalo</span>
      <GiftImage src={gift.imageUrl} title={gift.title || "Tu regalo"} />
      <span className="gift-merchant">
        {gift.url ? giftStore(gift.url) : "Tu tienda favorita"}
      </span>
      <h4>{gift.title || "El nombre del producto aparecerá aquí"}</h4>
      <p>
        {gift.description ||
          "Puedes añadir una nota, el color o el modelo que prefieres."}
      </p>
      <small>El invitado reserva aquí y compra en la tienda.</small>
    </aside>
  );
}
