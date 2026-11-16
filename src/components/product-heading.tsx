import { useTranslator } from "@/lib/i18n/react";
import { WeddingMark } from "./brand";
import Icon from "./icon";
import type { Kind } from "@/lib/events/types";
export default function ProductHeading({
  kind,
  area,
}: {
  kind: Kind;
  area: "editor" | "manager";
}) {
  const i18n = useTranslator();

  const wedding = kind === "wedding";
  return (
    <div className={`product-heading product-heading-${kind}`}>
      <div className="product-heading-mark">
        {wedding ? <WeddingMark /> : <Icon name="sparkle" />}
      </div>
      <div>
        <strong>{wedding ? "Save the Date" : "The Date"}</strong>
        <span>
          {area === "editor"
            ? wedding
              ? i18n("El diseño de vuestra historia")
              : i18n("Dale personalidad a tu evento")
            : wedding
              ? i18n("Vuestra boda · invitados y salón")
              : i18n("Tu evento · asistentes y distribución")}
        </span>
      </div>
      <small>
        {wedding ? i18n("ESTUDIO DE BODAS") : i18n("ESPACIO DE EVENTOS")}
      </small>
    </div>
  );
}
