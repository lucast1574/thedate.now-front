import { useRef, type PointerEvent } from "react";
import Icon from "@/components/icon";
import type { VenueArea } from "@/lib/events/venue-areas";
import { moveVenueArea } from "@/lib/events/venue-areas";
const icons = {
  snacks: "lucide:utensils",
  bar: "lucide:martini",
  stage: "lucide:mic-vocal",
  dance: "music",
  lounge: "lucide:sofa",
  photo: "lucide:camera",
  entrance: "lucide:door-open",
};
export default function VenueAreas({
  areas,
  width,
  height,
  selected,
  onSelect,
  onMove,
}: {
  areas: VenueArea[];
  width: number;
  height: number;
  selected: string;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}) {
  const layer = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    area: VenueArea;
    startX: number;
    startY: number;
  } | null>(null);
  function move(e: PointerEvent<HTMLButtonElement>) {
    const current = drag.current,
      rect = layer.current?.getBoundingClientRect();
    if (!current || !rect) return;
    const next = moveVenueArea(
      current.area,
      current.area.x + ((e.clientX - current.startX) * width) / rect.width,
      current.area.y + ((e.clientY - current.startY) * height) / rect.height,
      width,
      height,
    );
    onMove(next.id, next.x, next.y);
  }
  return (
    <div className="venue-areas" ref={layer}>
      {areas.map((area) => (
        <button
          key={area.id}
          type="button"
          className={`venue-area venue-area-${area.kind} ${selected === area.id ? "is-selected" : ""}`}
          style={{
            left: `${(area.x / width) * 100}%`,
            top: `${(area.y / height) * 100}%`,
            width: `${(area.width / width) * 100}%`,
            height: `${(area.height / height) * 100}%`,
            transform: `rotate(${area.rotation || 0}deg)`,
          }}
          aria-label={`${area.name}. Arrastra o usa las flechas para mover este espacio`}
          onClick={() => onSelect(area.id)}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            onSelect(area.id);
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { area, startX: e.clientX, startY: e.clientY };
          }}
          onPointerMove={move}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onLostPointerCapture={() => {
            drag.current = null;
          }}
          onKeyDown={(e) => {
            const steps: Record<string, [number, number]> = {
              ArrowLeft: [-20, 0],
              ArrowRight: [20, 0],
              ArrowUp: [0, -20],
              ArrowDown: [0, 20],
            };
            const step = steps[e.key];
            if (!step) return;
            e.preventDefault();
            const next = moveVenueArea(
              area,
              area.x + step[0],
              area.y + step[1],
              width,
              height,
            );
            onMove(next.id, next.x, next.y);
          }}
        >
          <Icon name={icons[area.kind]} />
          <strong>{area.name}</strong>
          {area.kind === "dance" && (
            <span className="dance-floor-grid" aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}
