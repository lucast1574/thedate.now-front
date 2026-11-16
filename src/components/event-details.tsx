import { useTranslator } from "@/lib/i18n/react";
import { formatEventDate } from "@/lib/events/date";

type Details = {
  startAt: string;
  timeZone: string;
  organizer: string;
  location: string;
  kind: string;
  isVirtual: boolean;
};
export default function EventDetails({
  event,
  variant = "invitation",
}: {
  event: Details;
  variant?: "invitation" | "rsvp";
}) {
  const i18n = useTranslator();

  const virtual = event.isVirtual;
  const fields = {
    when: {
      label: i18n("CUÁNDO"),
      value: formatEventDate(event.startAt, event.timeZone, i18n),
    },
    where: {
      label: virtual ? "MODALIDAD" : i18n("DÓNDE"),
      value: virtual ? i18n("En línea") : event.location,
    },
    who: {
      label: i18n("ORGANIZA"),
      value: event.organizer || i18n("El anfitrión"),
    },
  };
  const order =
    variant === "rsvp"
      ? [fields.when, fields.who, fields.where]
      : [fields.when, fields.where, fields.who];
  return (
    <div className={variant === "rsvp" ? "rsvp-details" : "details"}>
      {order.map((field) => (
        <div key={field.label}>
          <small>{field.label}</small>
          <strong>{field.value}</strong>
        </div>
      ))}
    </div>
  );
}
