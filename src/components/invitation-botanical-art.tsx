export default function BotanicalArtwork() {
  const stem =
    "M-20 710C135 590 8 360 156 80M15 600C110 520 160 350 235 280M20 450C80 380 50 230 100 170";
  return (
    <>
      {[false, true].map((flip) => (
        <g
          key={String(flip)}
          transform={flip ? "translate(720 960) rotate(180)" : undefined}
        >
          <path
            d={stem}
            stroke="currentColor"
            strokeWidth="1.4"
            opacity=".38"
          />
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <g
              key={n}
              transform={`translate(${42 + n * 12} ${540 - n * 69}) rotate(${-25 + n * 10})`}
            >
              <path
                d="M0 0C-70-22-64-69-22-67C8-66 16-29 0 0Z"
                fill="currentColor"
                opacity=".08"
              />
              <path
                d="M0 0C70-22 72-66 35-73C5-77-5-30 0 0Z"
                fill="currentColor"
                opacity=".15"
              />
              <path d="M-18-56 0 0 37-60" stroke="currentColor" opacity=".28" />
            </g>
          ))}
          <g transform="translate(148 115)">
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <ellipse
                key={angle}
                rx="19"
                ry="45"
                cy="-28"
                transform={`rotate(${angle})`}
                stroke="currentColor"
                strokeWidth=".9"
                fill="currentColor"
                fillOpacity=".035"
                opacity=".6"
              />
            ))}
            <circle r="8" fill="currentColor" opacity=".5" />
          </g>
        </g>
      ))}
    </>
  );
}
