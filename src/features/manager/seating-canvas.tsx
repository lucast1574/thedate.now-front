import { useRef } from "react";
import type { PointerEvent } from "react";
import type { Attendee, SeatingPlan, SeatingTable } from "@/lib/events/seating";
import PersonGlyph from "@/components/person-glyph";
import { fullName } from "@/lib/events/attendees";
export default function SeatingCanvas({
  plan,
  people,
  selected,
  onSelect,
  onMove,
}: {
  plan: SeatingPlan;
  people: Attendee[];
  selected: string;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}) {
  const board = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    id: string;
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);
  function start(e: PointerEvent<HTMLButtonElement>, table: SeatingTable) {
    if (e.button !== 0) return;
    onSelect(table.id);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      id: table.id,
      x: table.x,
      y: table.y,
      startX: e.clientX,
      startY: e.clientY,
    };
  }
  function move(e: PointerEvent<HTMLButtonElement>) {
    const current = drag.current,
      rect = board.current?.getBoundingClientRect();
    if (!current || !rect) return;
    const dx = ((e.clientX - current.startX) * plan.width) / rect.width,
      dy = ((e.clientY - current.startY) * plan.height) / rect.height;
    if (Math.abs(dx) + Math.abs(dy) < 2) return;
    onMove(
      current.id,
      Math.round(Math.max(0, Math.min(1360, current.x + dx))),
      Math.round(Math.max(0, Math.min(800, current.y + dy))),
    );
  }
  return (
    <div className="seating-scroll">
      <div
        className="seating-board"
        ref={board}
        role="group"
        aria-label="Lienzo del salón. Arrastra mesas o usa las flechas del teclado."
      >
        <div className="venue-label">
          SALÓN · 1600 × 1000 · distribución orientativa
        </div>
        {plan.tables.map((table) => {
          const assigned = people.filter(
            (p) => plan.assignments[p.id] === table.id,
          );
          return (
            <button
              type="button"
              key={table.id}
              className={`seating-table ${selected === table.id ? "is-selected" : ""}`}
              style={{
                left: `${(table.x / plan.width) * 100}%`,
                top: `${(table.y / plan.height) * 100}%`,
              }}
              aria-label={`${table.name}, ${assigned.length} de ${table.capacity} personas. Seleccionar y mover mesa`}
              onClick={() => onSelect(table.id)}
              onPointerDown={(e) => start(e, table)}
              onPointerMove={move}
              onPointerUp={() => {
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
                if (steps[e.key]) {
                  e.preventDefault();
                  const [x, y] = steps[e.key];
                  onMove(
                    table.id,
                    Math.max(0, Math.min(1360, table.x + x)),
                    Math.max(0, Math.min(800, table.y + y)),
                  );
                }
              }}
            >
              <strong>{table.name}</strong>
              <span
                className={`table-shape table-${table.shape}`}
                style={{ transform: `rotate(${table.rotation}deg)` }}
              >
                {assigned.length}/{table.capacity}
              </span>
              <span className="table-people">
                {assigned.slice(0, 12).map((person) => (
                  <span key={person.id} title={fullName(person)}>
                    <PersonGlyph gender={person.gender} />
                  </span>
                ))}
                {assigned.length > 12 && <small>+{assigned.length - 12}</small>}
              </span>
            </button>
          );
        })}
        {!plan.tables.length && (
          <p className="canvas-empty">
            Añade tu primera mesa o genera una propuesta por familias.
          </p>
        )}
      </div>
    </div>
  );
}
