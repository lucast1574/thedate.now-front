import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const href = giftHref(item, giftURL);
  const content = (
    <>
      <Icon name="lucide:gift" />
      <span>{item.text || i18n("Lista de regalos")}</span>
      <ElementActionHint item={item} label={i18n("Ver regalos")} />
    </>
  );
  return href ? (
    <a
      className="flyer-gift-link"
      data-align={item.align}
      href={href}

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
