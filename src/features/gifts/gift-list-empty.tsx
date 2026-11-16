import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
export default function GiftListEmpty({ wedding }: { wedding: boolean }) {
  const i18n = useTranslator();
  return (
    <section className="gift-empty">
      <Icon name="lucide:gift" />
      <h2>{i18n("Estamos preparando la lista")}</h2>
      <p>
        {wedding
          ? i18n(
              "Los novios aún no han añadido sus regalos. Vuelve pronto para descubrir su lista de deseos.",
            )
          : i18n(
              "Quien organiza aún está preparando su lista de deseos. Vuelve pronto para descubrir las ideas de regalos.",
            )}
      </p>
    </section>
  );
}
