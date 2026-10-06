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
              ? "El diseño de vuestra historia"
              : "Dale personalidad a tu evento"
            : wedding
              ? "Vuestra boda · invitados y salón"
              : "Tu evento · asistentes y distribución"}
        </span>
      </div>
      <small>{wedding ? "ESTUDIO DE BODAS" : "ESPACIO DE EVENTOS"}</small>
    </div>
  );
}
