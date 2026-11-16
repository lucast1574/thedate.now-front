import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const content = (
    <>
      <Icon name="calendar" />
      <span>{item.text || i18n("Añadir al calendario")}</span>
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
