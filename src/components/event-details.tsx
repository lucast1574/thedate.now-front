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
  const virtual = event.kind === "general" && event.isVirtual;
  const fields = {
    when: {
      label: "CUÁNDO",
      value: formatEventDate(event.startAt, event.timeZone),
    },
    where: {
      label: virtual ? "MODALIDAD" : "DÓNDE",
      value: virtual ? "En línea" : event.location,
    },
    who: { label: "ORGANIZA", value: event.organizer || "El anfitrión" },
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
