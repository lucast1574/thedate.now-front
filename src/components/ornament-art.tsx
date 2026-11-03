import { useId, type CSSProperties } from "react";
import { ornamentById } from "@/lib/events/ornaments";
export default function OrnamentArt({
  name,
  style,
}: {
  name: string;
  style?: CSSProperties;
}) {
  const filterId = `floral-${useId().replace(/[^a-z0-9]/gi, "")}`;
  const drawing = ornamentById(name);
  if (!drawing) return null;
  return (
    <svg
      viewBox="0 0 200 200"
      style={style}
      preserveAspectRatio={
        ["tides", "cameo", "ticket"].includes(drawing.id) ? "none" : undefined
      }
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {"asset" in drawing ? (
        <>
          <defs>
            <filter id={filterId} x="0" y="0" width="100%" height="100%">
              <feFlood floodColor="currentColor" result="ink" />
              <feComposite in="ink" in2="SourceAlpha" operator="in" />
            </filter>
          </defs>
          <image
            href={drawing.asset}
            width="200"
            height="200"
            filter={`url(#${filterId})`}
          />
        </>
      ) : (
        <path d={drawing.path} />
      )}
    </svg>
  );
}
