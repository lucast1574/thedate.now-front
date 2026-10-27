import type { CSSProperties } from "react";
import FlyerBackground from "@/components/flyer-background";
import Icon from "@/components/icon";
import { flyerFonts } from "@/lib/events/flyer";
import type { Opening } from "@/lib/events/celebration";
import { openingPreset } from "@/lib/events/opening-presets";
import OpeningArtwork from "./opening-artwork";
export default function OpeningScene({
  opening,
  title,
  wedding,
  photoURL,
  phase,
  onOpen,
  preview = false,
}: {
  opening: Opening;
  title: string;
  wedding: boolean;
  photoURL: (key: string) => string;
  phase: "closed" | "opening";
  onOpen: () => void;
  preview?: boolean;
}) {
  const Heading = preview ? "h3" : "h1";
  return (
    <div
      className="opening-scene"
      data-style={opening.style}
      data-phase={phase}
      style={
        {
          "--envelope-paper": opening.color,
          "--envelope-ink": opening.ink,
          "--opening-duration": `${openingPreset(opening.style).duration}ms`,
        } as CSSProperties
      }
    >
      {opening.backgroundImage && (
        <FlyerBackground
          slice={{
            image: opening.backgroundImage,
            offset: 0,
            total: 1,
            height: 1,
          }}
          photoURL={photoURL}
        />
      )}
      <div className="opening-intro">
        <span>
          {wedding ? "Con todo nuestro cariño" : "Una fecha para recordar"}
        </span>
        <Heading
          id={preview ? undefined : "opening-title"}
          style={
            opening.font ? { fontFamily: flyerFonts[opening.font] } : undefined
          }
        >
          {opening.title || title || "Tu invitación"}
        </Heading>
        <p>{opening.message}</p>
      </div>
      <button
        className="opening-envelope"
        onClick={onOpen}
        aria-label={opening.buttonLabel || "Abrir invitación"}
        disabled={phase === "opening"}
      >
        <OpeningArtwork opening={opening} title={title} wedding={wedding} />
      </button>
      <button
        className="opening-action"
        onClick={onOpen}
        disabled={phase === "opening"}
      >
        {phase === "opening"
          ? "Abriendo tu invitación…"
          : opening.buttonLabel || "Abrir invitación"}
        <Icon name="arrow" />
      </button>
    </div>
  );
}
