import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import type { Opening } from "@/lib/events/celebration";
import { openingPreset } from "@/lib/events/opening-presets";
export default function OpeningArtwork({
  opening,
  title,
}: {
  opening: Opening;
  title: string;
  wedding: boolean;
}) {
  const i18n = useTranslator();

  const icon = opening.sealIcon || openingPreset(opening.style, i18n).icon;
  return (
    <span
      className="opening-artwork"
      data-style={opening.style}
      aria-hidden="true"
    >
      <span className="opening-letter">
        {icon !== "none" && <Icon name={icon} />}
        <span>{opening.title || title}</span>
      </span>
      {opening.style === "classic" && (
        <>
          <span className="opening-pocket" />
          <span className="opening-fold" />
        </>
      )}
      {opening.style === "arch" && (
        <>
          <span className="opening-door door-left">
            <Icon name="leaf" />
          </span>
          <span className="opening-door door-right">
            <Icon name="leaf" />
          </span>
        </>
      )}
      {opening.style === "ticket" && (
        <>
          <span className="opening-ticket-main">
            <small>{i18n("UNA FECHA PARA RECORDAR")}</small>
            <strong>
              {i18n("ESTÁS")} <br />
              {i18n("INVITADO")}
            </strong>
            <span className="opening-barcode" />
          </span>
          <span className="opening-ticket-stub">
            <small>{i18n("ADMIT ONE")}</small>
          </span>
        </>
      )}
      {opening.style === "curtain" && (
        <>
          <span className="opening-curtain curtain-left" />
          <span className="opening-curtain curtain-right" />
          <span className="opening-valance" />
        </>
      )}
      {opening.style === "bloom" && (
        <span className="opening-petals">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} style={{ "--petal": i } as React.CSSProperties} />
          ))}
        </span>
      )}
      {opening.style === "orbit" && (
        <>
          <span className="opening-orbit orbit-one" />
          <span className="opening-orbit orbit-two" />
          <span className="opening-orbit orbit-three" />
          <span className="opening-stars">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} style={{ "--petal": i } as React.CSSProperties}>
                <Icon name="sparkle" />
              </span>
            ))}
          </span>
        </>
      )}
      {icon !== "none" && (
        <span className="opening-seal">
          <Icon name={icon} />
        </span>
      )}
    </span>
  );
}
