import { giftStore } from "@/lib/events/gift-store";
import type { Gift } from "@/lib/events/wishlist";
import GiftImage from "./gift-image";
export default function GiftFormPreview({ gift }: { gift: Gift }) {
  return (
    <aside className="gift-form-preview" aria-label="Vista previa del producto">
      <GiftImage src={gift.imageUrl} title={gift.title || "Tu regalo"} />
      <div>
        <small>{gift.url ? giftStore(gift.url) : "Vista previa"}</small>
        <h4>{gift.title || "Tu regalo"}</h4>
      </div>
    </aside>
  );
}
