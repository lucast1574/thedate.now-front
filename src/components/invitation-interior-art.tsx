import type { FlyerCanvas } from "@/lib/events/flyer";
export default function InvitationInteriorArt({
  style,
  color,
}: {
  style: FlyerCanvas["art"];
  color: string;
}) {
  return (
    <svg
      className={`invitation-artwork art-${style} art-interior`}
      viewBox="0 0 720 960"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      style={{ color }}
    >
      {style === "gala" && (
        <>
          <path
            d="M26 190V26H190M530 934H694V770M36 170V36H170M550 924H684V790"
            stroke="currentColor"
            opacity=".3"
          />
          <g transform="translate(675 70)">
            <path
              d="m0-12 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z"
              fill="currentColor"
              opacity=".5"
            />
          </g>
        </>
      )}
      {style === "romance" && (
        <>
          <path
            d="M30 175V30H175M545 930H690V785"
            stroke="currentColor"
            opacity=".2"
          />
          <g transform="translate(670 880)">
            <path
              d="M0 50V-30M0 0q-40-45-20-40Q5-30 0 0q40-45 20-40Q-5-30 0 0M0 25q-30-30-20-40Q0-20 0 25"
              stroke="currentColor"
              opacity=".3"
            />
          </g>
        </>
      )}
      {style === "botanical" && (
        <g>
          <path
            d="M18 960q45-120 5-300M28 810q-45-55-10-70 35 20 10 70m0 50q55-40 30-60-30 10-30 60M700 0q-45 130-8 240M690 100q-50 35-27 55 35-12 27-55"
            stroke="currentColor"
            opacity=".25"
          />
        </g>
      )}
      {style === "editorial" && (
        <>
          <path
            d="M32 40H190M530 920H688M32 40v14M688 906v14"
            stroke="currentColor"
            opacity=".4"
          />
          <circle cx="680" cy="70" r="13" stroke="currentColor" opacity=".2" />
        </>
      )}
      {style === "fiesta" && (
        <>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <g
              key={n}
              transform={`translate(${n % 2 ? 695 : 25} ${100 + n * 145}) rotate(${n * 32})`}
            >
              <path d="M-3-8H3V8H-3" fill="currentColor" opacity=".3" />
              <circle cx="9" cy="10" r="2" fill="currentColor" opacity=".25" />
            </g>
          ))}
        </>
      )}
      {style === "coastal" && (
        <>
          {[0, 1, 2].map((n) => (
            <path
              key={n}
              d={`M-20 ${905 + n * 17}q180-55 360 0t400 0`}
              stroke="currentColor"
              opacity=".16"
            />
          ))}
        </>
      )}
    </svg>
  );
}
