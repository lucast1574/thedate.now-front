import { useTranslator } from "@/lib/i18n/react";
import { giftStore } from "@/lib/events/gift-store";
import type { Gift } from "@/lib/events/wishlist";
import GiftImage from "./gift-image";
export default function GiftFormPreview({ gift }: { gift: Gift }) {
  const i18n = useTranslator();

  return (
    <aside
      className="gift-form-preview"
      aria-label={i18n("Vista previa del producto")}
    >
      <GiftImage src={gift.imageUrl} title={gift.title || i18n("Tu regalo")} />
      <div>
        <small>{gift.url ? giftStore(gift.url) : i18n("Vista previa")}</small>
        <h4>{gift.title || i18n("Tu regalo")}</h4>
      </div>
    </aside>
  );
}
