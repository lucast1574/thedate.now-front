import { useId } from "react";
import InvitationArtClearSpace from "./invitation-art-clear-space";
import InvitationInteriorArt from "./invitation-interior-art";
import BotanicalArtwork from "./invitation-botanical-art";
import {
  RomanceArtwork,
  GalaArtwork,
  EditorialArtwork,
} from "./invitation-stationery-art";
import {
  CoastalArtwork,
  CelebrationArtwork,
} from "./invitation-celebration-art";
import type { FlyerCanvas } from "@/lib/events/flyer";
export default function InvitationArtwork({
  style,
  color,
  interior = false,
  canvas,
}: {
  style: FlyerCanvas["art"];
  color: string;
  interior?: boolean;
  canvas?: FlyerCanvas;
}) {
  const maskId = useId();
  if (!style) return null;
  if (interior) return <InvitationInteriorArt style={style} color={color} />;
  return (
    <svg
      className={`invitation-artwork art-${style}`}
      viewBox="0 0 720 960"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      style={{ color }}
    >
      {canvas && <InvitationArtClearSpace id={maskId} canvas={canvas} />}
      <g className="art-content" mask={canvas ? `url(#${maskId})` : undefined}>
        {style === "botanical" && <BotanicalArtwork />}
        {style === "romance" && <RomanceArtwork />}
        {style === "gala" && <GalaArtwork />}
        {style === "editorial" && <EditorialArtwork />}
        {style === "fiesta" && <CelebrationArtwork />}
        {style === "coastal" && <CoastalArtwork />}
      </g>
    </svg>
  );
}
