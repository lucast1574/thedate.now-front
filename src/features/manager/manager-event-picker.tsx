import { useRouter } from "next/navigation";
import Listbox from "@/components/listbox";
import {
  organizationEvents,
  organizationEventLabel,
} from "@/lib/events/organization-events";
import type { Event } from "@/lib/events/types";

export default function ManagerEventPicker({
  events,
  event,
  tab,
  guard,
}: {
  events: Event[];
  event: Event;
  tab: string;
  guard: () => boolean;
}) {
  const router = useRouter();
  const items = organizationEvents(events, event.kind);
  return (
    <div className="organization-event-picker manager-event-picker">
      <label>
        {event.kind === "wedding" ? "Boda" : "Evento"}
        {items.length > 1 ? (
          <Listbox
            value={event.id}
            onValueChange={(id) => {
              if (!guard()) return;
              const next = items.find((item) => item.id === id);
              router.push(
                next?.paymentStatus === "paid"
                  ? `/manager/${encodeURIComponent(id)}?tab=${tab}`
                  : `/organizar?tool=${tab}&event=${encodeURIComponent(id)}`,
              );
            }}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {organizationEventLabel(item)}
              </option>
            ))}
          </Listbox>
        ) : (
          <span className="manager-event-context">
            {organizationEventLabel(event)}
          </span>
        )}
      </label>
    </div>
  );
}
