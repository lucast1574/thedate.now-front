import type { FlyerCanvas } from "@/lib/events/flyer";
export default function InvitationArtClearSpace({
  id,
  canvas,
}: {
  id: string;
  canvas: FlyerCanvas;
}) {
  return (
    <defs>
      <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <mask
        id={id}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="720"
        height="960"
      >
        <rect width="720" height="960" fill="white" />
        {canvas.elements
          .filter((e) => e.type === "text")
          .map((e) => (
            <rect
              key={e.id}
              x={e.x - 18}
              y={((e.y - 18) * 960) / canvas.height}
              width={e.width + 36}
              height={((e.height + 36) * 960) / canvas.height}
              rx="10"
              fill="black"
              filter={`url(#${id}-soft)`}
              transform={
                e.rotation
                  ? `rotate(${e.rotation} ${e.x + e.width / 2} ${((e.y + e.height / 2) * 960) / canvas.height})`
                  : undefined
              }
            />
          ))}
      </mask>
    </defs>
  );
}
