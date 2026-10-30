import Icon from "./icon";
import { calendarDownload } from "@/lib/events/calendar";
import type { FlyerElement } from "@/lib/events/flyer";
import type { PublicEvent } from "@/lib/events/types";
export default function FlyerCalendarLink({
  item,
  event,
}: {
  item: FlyerElement;
  event?: Partial<PublicEvent>;
}) {
  const content = (
    <>
      <Icon name="calendar" />
      <span>{item.text || "Añadir al calendario"}</span>
    </>
  );
  const href = calendarDownload(event);
  return href ? (
    <a
      className="flyer-calendar-link"
      data-align={item.align}
      href={href}
      download="invitacion.ics"
    >
      {content}
    </a>
  ) : (
    <span className="flyer-calendar-link" data-align={item.align}>
      {content}
    </span>
  );
}
