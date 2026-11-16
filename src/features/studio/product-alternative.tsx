import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
export default function ProductAlternative({
  wedding,
  footer = false,
}: {
  wedding: boolean;
  footer?: boolean;
}) {
  const i18n = useTranslator();

  return (
    <div
      className={`workspace-alternative ${footer ? "workspace-mobile-alternative" : ""}`}
    >
      <span>
        {wedding
          ? i18n("¿Otra ocasión para celebrar?")
          : i18n("¿Preparando una boda?")}
      </span>
      <a
        href={
          wedding
            ? "https://crea.thedate.now"
            : "https://studio.save.thedate.now"
        }
      >
        {wedding ? i18n("Descubre The Date") : i18n("Descubre Save the Date")}
        <Icon name="external" />
      </a>
    </div>
  );
}
