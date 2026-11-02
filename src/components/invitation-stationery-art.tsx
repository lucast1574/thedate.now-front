import { GardenRose, OliveBranch } from "./invitation-botanical-art";
export function RomanceArtwork() {
  return (
    <>
      <path
        d="M58 960V332C58 14 662 14 662 332V960Z"
        fill="currentColor"
        opacity=".045"
      />
      <path
        d="M76 960V332C76 40 644 40 644 332V960"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity=".3"
      />
      <g transform="translate(85 815) rotate(-28) scale(.55)" opacity=".55">
        <OliveBranch />
      </g>
      <g
        transform="translate(642 806) rotate(28) scale(-.55 .55)"
        opacity=".55"
      >
        <OliveBranch />
      </g>
      <g transform="translate(111 894) rotate(20)" opacity=".6">
        <GardenRose />
      </g>
      <g transform="translate(611 894) rotate(-30)" opacity=".6">
        <GardenRose />
      </g>
      <g stroke="currentColor" strokeWidth="1.5" opacity=".6">
        <path
          d="M360 116C331 60 278 72 296 105C308 122 339 119 360 116C389 60 442 72 424 105C412 122 381 119 360 116Z"
          fill="currentColor"
          fillOpacity=".06"
        />
        <path d="M355 118C337 150 347 178 316 202L313 177 294 181C320 158 318 133 350 116M365 118C383 150 373 178 404 202L407 177 426 181C400 158 402 133 370 116" />
        <path
          d="M354 111q6-5 12 0l-1 12h-10Z"
          fill="currentColor"
          fillOpacity=".15"
        />
      </g>
    </>
  );
}
export function GalaArtwork() {
  return (
    <>
      <path
        d="M24 0H0V960H24ZM696 0H720V960H696Z"
        fill="currentColor"
        opacity=".07"
      />
      {[0, 1, 2, 3].map((n) => (
        <g
          key={n}
          transform={`translate(${n % 2 ? 684 : 36} ${n < 2 ? 36 : 924}) scale(${n % 2 ? -1 : 1} ${n < 2 ? 1 : -1})`}
          stroke="currentColor"
          opacity=".55"
        >
          <path d="M0 180V0H180M10 150V10H150M20 120V20H120M30 90V30H90" />
          <path d="M0 72 72 0M0 108 108 0M0 144 144 0" opacity=".4" />
          <path d="M38 38H62V62H38Z" fill="currentColor" fillOpacity=".12" />
        </g>
      ))}
      <g transform="translate(360 105)" stroke="currentColor" opacity=".65">
        <path d="M-44 0-22-20 0-48 22-20 44 0 22 20 0 48-22 20Z" />
        <path
          d="M-22 0 0-28 22 0 0 28Z"
          fill="currentColor"
          fillOpacity=".12"
        />
        <path d="M-80 0H-44M44 0H80M0-70V-48M0 48V70" />
      </g>
    </>
  );
}
export function EditorialArtwork() {
  return (
    <>
      <path
        d="M0 0H720V28H0ZM0 932H720V960H0Z"
        fill="currentColor"
        opacity=".16"
      />
      <path d="M0 0H26V960H0Z" fill="currentColor" opacity=".055" />
      <g transform="translate(627 91)" stroke="currentColor" opacity=".4">
        <path d="M0-35C-47-35-47 35 0 35C47 35 47-35 0-35ZM-22-24 22 24M-22 24 22-24" />
        <path d="M-35 0H35M0-35V35" />
      </g>
    </>
  );
}
