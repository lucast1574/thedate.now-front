// Botanical engraving: irregular leaves, veins and open garden roses.
export function GardenRose() {
  return (
    <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path
        d="M-5-8C-23-35 15-42 23-17C48-31 56 7 30 21C40 46 3 60-13 33C-42 45-56 10-29-5C-39-28-15-44-5-8Z"
        fill="currentColor"
        fillOpacity=".07"
      />
      <path d="M-5-8C14-24 33-7 19 8C34 25 7 40-6 22C-28 31-37 5-16-4C-20-21-2-27 9-14M-16-4C-3-12 14-4 9 9C-4 23-19 9-7 1C-1-3 8 4 2 9" />
      <path
        d="M-29-5C-21-1-20 17-13 33M23-17C22-2 38 7 30 21M-5-8C-9-21-21-24-26-23M-6 22C2 29 2 41 13 42M19 8C31 9 39 1 42-6"
        opacity=".6"
      />
      <path
        d="M-26-18l7 6m-18 16 9 4m-5 13 11-2m33 23-3-10m26-19-10 1m-9-35-4 10"
        opacity=".35"
      />
    </g>
  );
}
export function OliveBranch() {
  return (
    <g stroke="currentColor" strokeWidth="1.1">
      <path d="M0 310C22 200-20 96 26-32" />
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <g
          key={n}
          transform={`translate(${n % 2 ? 5 : 0} ${250 - n * 46}) rotate(${n * 5 - 12})`}
        >
          <path
            d="M0 0C-36-1-67-28-55-61C-22-56-5-32 0 0ZM1-7C35-10 61-40 50-65C22-56 7-36 1-7Z"
            fill="currentColor"
            fillOpacity={n % 2 ? ".12" : ".07"}
          />
          <path
            d="M0 0-48-53M1-7 44-57M-24-27l-15 1m21-9-1-13M23-34l14-4m-21 14 2-15"
            opacity=".45"
          />
        </g>
      ))}
    </g>
  );
}
export default function BotanicalArtwork() {
  return (
    <>
      <g transform="translate(28 118) rotate(-13)" opacity=".55">
        <OliveBranch />
      </g>
      <g transform="translate(695 845) rotate(166)" opacity=".55">
        <OliveBranch />
      </g>
      <g transform="translate(65 70) scale(1.6)" opacity=".75">
        <GardenRose />
      </g>
      <g transform="translate(136 38) rotate(38)" opacity=".5">
        <GardenRose />
      </g>
      <g transform="translate(656 888) rotate(150) scale(1.5)" opacity=".7">
        <GardenRose />
      </g>
      <g transform="translate(580 929) rotate(80)" opacity=".45">
        <GardenRose />
      </g>
    </>
  );
}
