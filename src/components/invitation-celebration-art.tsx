export function CoastalArtwork() {
  return (
    <>
      <g
        transform="translate(565 133) rotate(24)"
        stroke="currentColor"
        opacity=".45"
      >
        <path
          d="M0 66C-100 9-100-69-66-63C-51-104-20-92 0-107C20-92 51-104 66-63C100-69 100 9 0 66Z"
          fill="currentColor"
          fillOpacity=".065"
        />
        {[-66, -44, -22, 0, 22, 44, 66].map((x) => (
          <path
            key={x}
            d={`M0 66Q${x * 0.35} 2 ${x} ${-107 + Math.abs(x) * 0.67}`}
          />
        ))}
        <path
          d="M-16 63q16-20 32 0l-3 17h-26Z"
          fill="currentColor"
          fillOpacity=".1"
        />
      </g>
      {Array.from({ length: 9 }, (_, n) => (
        <path
          key={n}
          d={`M-60 ${825 + n * 18}C130 ${745 + n * 19} 235 ${925 + n * 6} 430 ${850 + n * 15}S640 ${780 + n * 23} 780 ${850 + n * 16}`}
          stroke="currentColor"
          strokeWidth={n % 3 === 0 ? 1.5 : 0.65}
          opacity={0.13 + n * 0.014}
        />
      ))}
    </>
  );
}
export function CelebrationArtwork() {
  return (
    <>
      <g transform="translate(630 72)" fill="currentColor" opacity=".18">
        {Array.from({ length: 24 }, (_, n) => (
          <path
            key={n}
            d="M-3-38-8-122 8-122 3-38Z"
            transform={`rotate(${n * 15})`}
          />
        ))}
        <circle r="24" />
      </g>
      <g stroke="currentColor" fill="none" opacity=".45">
        <path
          d="M-25 685C150 620 144 835 62 810C-22 785 117 720 160 850S275 956 302 932"
          strokeWidth="7"
        />
        <path
          d="M-28 698C139 637 129 820 67 795C12 774 125 747 146 854S277 974 309 946"
          strokeWidth="1.2"
        />
        <path
          d="M675 365C597 344 655 260 708 314S783 426 700 470"
          strokeWidth="5"
        />
      </g>
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <g
          key={n}
          transform={`translate(${n % 2 ? 655 : 40} ${155 + n * 133}) rotate(${n * 27})`}
          fill="currentColor"
          opacity=".35"
        >
          <path d="M-3-11H3V11H-3Z" />
          <circle cx="19" cy="18" r="3" />
        </g>
      ))}
    </>
  );
}
