import type { CSSProperties } from "react";
import { ornamentById } from "@/lib/events/ornaments";
export default function OrnamentArt({
  name,
  style,
}: {
  name: string;
  style?: CSSProperties;
}) {
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
      <path d={drawing.path} />
    </svg>
  );
}
