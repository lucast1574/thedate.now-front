import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Attendee, SeatingPlan, SeatingTable } from "@/lib/events/seating";
import type { VenueArea } from "@/lib/events/venue-areas";
import TableGuestPopover from "./table-guest-popover";
import VenueAreaPopover from "./venue-area-popover";
export default function TableGuestWorkspace({
  children,
  table,
  area,
  plan,
  people,
  limit,
  onChange,
}: {
  children: ReactNode;
  table?: SeatingTable;
  area?: VenueArea;
  plan: SeatingPlan;
  people: Attendee[];
  limit: number;
  onChange: (plan: SeatingPlan) => void;
}) {
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    maxHeight: number;
  } | null>(null);
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLElement | null>(null);
  const pointer = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  function close() {
    setPosition(null);
    trigger.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (!position) return;
    root.current
      ?.querySelector<HTMLButtonElement>(".table-guest-popover button")
      ?.focus();
    function outside(e: PointerEvent) {
      if (
        !(e.target as Element).closest(
          ".table-guest-popover, .seating-table, .venue-area",
        )
      )
        setPosition(null);
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPosition(null);
        trigger.current?.focus({ preventScroll: true });
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [position]);
  return (
    <div
      ref={root}
      className="seating-workspace seating-workspace-wide seating-toolbar-workspace"
      onPointerDownCapture={(e) => {
        pointer.current = { x: e.clientX, y: e.clientY, moved: false };
        if ((e.target as Element).closest(".seating-table, .venue-area"))
          setPosition(null);
      }}
      onPointerMoveCapture={(e) => {
        const p = pointer.current;
        if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 5) {
          p.moved = true;
          if ((e.target as Element).closest(".seating-table, .venue-area"))
            setPosition(null);
        }
      }}
      onClick={(e) => {
        const button = (e.target as Element).closest<HTMLElement>(
          ".seating-table, .venue-area",
        );
        if (!button || (e.detail !== 0 && pointer.current?.moved)) return;
        const frame = root.current
            ?.querySelector(".seating-scroll")
            ?.getBoundingClientRect(),
          base = root.current?.getBoundingClientRect(),
          anchor = button.getBoundingClientRect();
        if (!frame || !base) return;
        const width = Math.min(310, frame.width - 20);
        const left =
          anchor.right + 10 + width <= frame.right - 8
            ? anchor.right + 10
            : anchor.left - width - 10 >= frame.left + 8
              ? anchor.left - width - 10
              : Math.max(
                  frame.left + 8,
                  Math.min(anchor.left, frame.right - width - 8),
                );
        const top = Math.max(
          frame.top + 8,
          Math.min(
            anchor.top,
            Math.min(frame.bottom, window.innerHeight) - 330,
          ),
        );
        trigger.current = button;
        setPosition({
          left: left - base.left,
          top: top - base.top,
          maxHeight: Math.max(
            180,
            Math.min(
              430,
              Math.min(frame.bottom, window.innerHeight - 10) - top,
            ),
          ),
        });
      }}
    >
      {children}
      {position && (table || area) && (
        <div
          className="table-guest-popover"
          role="dialog"
          aria-labelledby="table-popover-title"
          style={position}
        >
          {table ? (
            <TableGuestPopover
              key={table.id}
              table={table}
              plan={plan}
              people={people}
              limit={limit}
              onChange={onChange}
              onClose={close}
            />
          ) : (
            area && (
              <VenueAreaPopover
                area={area}
                plan={plan}
                onChange={onChange}
                onClose={close}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
