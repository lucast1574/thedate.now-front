import { useId } from "react";
import InvitationArtClearSpace from "./invitation-art-clear-space";
import InvitationInteriorArt from "./invitation-interior-art";
import BotanicalArtwork from "./invitation-botanical-art";
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
        {style === "romance" && (
          <>
            <path
              d="M53 960V330C53-35 667-35 667 330V960"
              fill="currentColor"
              opacity=".035"
            />
            <path
              d="M74 920V330C74 8 646 8 646 330V920M88 920V330C88 30 632 30 632 330V920"
              stroke="currentColor"
              opacity=".22"
            />
            {[0, 1].map((n) => (
              <g
                key={n}
                transform={`translate(${n ? 615 : 105} 840) rotate(${n ? -30 : 30})`}
              >
                <path
                  d="M0 100V0M0 40C-50 15-45-35 0 0C45-35 50 15 0 40"
                  stroke="currentColor"
                  opacity=".4"
                />
                <path
                  d="M0 60C-35 35-50 65 0 80C50 65 35 35 0 60"
                  fill="currentColor"
                  opacity=".12"
                />
              </g>
            ))}
            <path
              d="M270 94Q360 140 450 94M330 112l30 20 30-20"
              stroke="currentColor"
              opacity=".4"
            />
          </>
        )}
        {style === "gala" && (
          <>
            <path
              d="M28 28H692V932H28ZM40 40H680V920H40Z"
              stroke="currentColor"
              opacity=".24"
            />
            {[0, 1, 2, 3].map((n) => (
              <g
                key={n}
                transform={`translate(${n % 2 ? 680 : 40} ${n < 2 ? 40 : 920}) rotate(${n === 0 ? 0 : n === 1 ? 90 : n === 2 ? -90 : 180})`}
              >
                <path
                  d="M0 120V0H120M12 94V12H94M24 65V24H65M0 60 60 0"
                  stroke="currentColor"
                  opacity=".65"
                />
              </g>
            ))}
            <path
              d="m360 65 8 20 20 8-20 8-8 20-8-20-20-8 20-8Z"
              fill="currentColor"
              opacity=".5"
            />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
              <circle
                key={n}
                cx={110 + ((n * 71) % 510)}
                cy={160 + ((n * 103) % 650)}
                r={n % 2 ? 1.5 : 2.5}
                fill="currentColor"
                opacity=".2"
              />
            ))}
          </>
        )}
        {style === "editorial" && (
          <>
            <path
              d="M0 0H720V115H0ZM0 855H720V960H0Z"
              fill="currentColor"
              opacity=".045"
            />
            <path
              d="M34 190V34H190M530 926H686V770"
              stroke="currentColor"
              strokeWidth="2"
              opacity=".4"
            />
            <circle
              cx="655"
              cy="64"
              r="30"
              stroke="currentColor"
              opacity=".2"
            />
            <circle
              cx="655"
              cy="64"
              r="20"
              stroke="currentColor"
              opacity=".2"
            />
          </>
        )}
        {style === "fiesta" && (
          <>
            <path
              d="M0 0H720V95Q360 180 0 95ZM0 960H720V860Q360 780 0 860Z"
              fill="currentColor"
              opacity=".075"
            />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
              <g
                key={n}
                transform={`translate(${35 + ((n * 137) % 655)} ${n % 2 ? 830 + ((n * 13) % 100) : 25 + ((n * 17) % 100)}) rotate(${n * 31})`}
              >
                <path d="M-5-12H5V12H-5Z" fill="currentColor" opacity=".35" />
                <circle
                  cx="24"
                  cy="18"
                  r="4"
                  stroke="currentColor"
                  opacity=".3"
                />
              </g>
            ))}
          </>
        )}
        {style === "coastal" && (
          <>
            {[0, 1, 2, 3].map((n) => (
              <path
                key={n}
                d={`M-80 ${860 + n * 24}Q140 ${720 + n * 35} 360 ${860 + n * 10}T800 ${835 + n * 30}`}
                stroke="currentColor"
                strokeWidth={n === 0 ? 70 : 1}
                opacity={n === 0 ? 0.045 : 0.18}
              />
            ))}
            <circle
              cx="580"
              cy="100"
              r="110"
              fill="currentColor"
              opacity=".04"
            />
            <path
              d="M50 150Q200 10 380 70T740 30"
              stroke="currentColor"
              opacity=".2"
            />
          </>
        )}
      </g>
    </svg>
  );
}
