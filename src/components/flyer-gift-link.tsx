import Icon from "./icon";
import ElementActionHint from "./element-action-hint";
import type { FlyerElement } from "@/lib/events/flyer";
import { giftHref } from "@/lib/events/gift-link";
export default function FlyerGiftLink({
  item,
  giftURL,
}: {
  item: FlyerElement;
  giftURL?: string;
}) {
  const href = giftHref(item, giftURL);
  const content = (
    <>
      <Icon name="lucide:gift" />
      <span>{item.text || "Lista de regalos"}</span>
      <ElementActionHint item={item} label="Ver regalos" />
    </>
  );
  return href ? (
    <a
      className="flyer-gift-link"
      data-align={item.align}
      href={href}
      target={item.link === "/regalos" ? undefined : "_blank"}
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <span className="flyer-gift-link" data-align={item.align}>
      {content}
    </span>
  );
}
