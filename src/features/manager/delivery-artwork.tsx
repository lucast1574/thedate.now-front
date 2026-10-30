import Icon from "@/components/icon";
import type { Delivery } from "./use-invitation-delivery";

export default function DeliveryArtwork({
  phase,
}: {
  phase: Delivery["phase"];
}) {
  return (
    <div className="delivery-artwork" aria-hidden="true">
      <svg viewBox="0 0 260 180" fill="none">
        <ellipse
          cx="132"
          cy="158"
          rx="83"
          ry="7"
          className="delivery-art-shadow"
        />
        <path
          className="delivery-flight-path"
          d="M14 105C-2 48 52 10 88 25M179 32c48-34 98 21 54 55"
        />
        <g className="delivery-envelope">
          <path
            d="m53 77 77-54 77 54v70H53Z"
            className="delivery-envelope-back"
          />
          <g className="delivery-letter">
            <rect x="70" y="36" width="120" height="98" rx="5" />
            <path d="M94 59h72M94 69h52M94 92h72M94 102h61" />
            <path d="m125 80 5 5 9-10" />
          </g>
          <path
            d="M53 77v70h154V77l-77 48Z"
            className="delivery-envelope-front"
          />
          <path
            d="m53 147 59-43m95 43-59-43"
            className="delivery-envelope-fold"
          />
        </g>
      </svg>
      <span className="delivery-art-seal">
        <Icon
          name={
            phase === "complete"
              ? "check"
              : phase === "error" || phase === "attention"
                ? "clock"
                : phase === "waiting"
                  ? "clock"
                  : "heart"
          }
        />
      </span>
      <span className="delivery-art-caption">
        {phase === "complete"
          ? "Ya están en camino"
          : phase === "sending"
            ? "De tu historia a su WhatsApp"
            : phase === "waiting"
              ? "Cada invitado tiene su momento"
              : phase === "attention" || phase === "error"
                ? "Tu lista está a salvo"
                : "Una invitación, muchos encuentros"}
      </span>
    </div>
  );
}
