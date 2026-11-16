import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import { ticketStateLabel, ticketDate, type Ticket } from "@/lib/support/types";

export default function TicketList({
  tickets,
  selectedID,
  onSelect,
}: {
  tickets: Ticket[];
  selectedID?: string;
  onSelect: (ticket: Ticket) => void;
}) {
  const i18n = useTranslator();

  return (
    <ul className="support-list">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <button
            type="button"
            aria-pressed={selectedID === ticket.id}
            onClick={() => onSelect(ticket)}
          >
            <span className="support-state" data-state={ticket.state}>
              {ticketStateLabel(ticket.state, i18n)}
            </span>
            <strong>{ticket.title}</strong>
            {ticket.requester && <span>{ticket.requester.name}</span>}
            <time dateTime={ticket.createdAt}>
              {ticketDate(ticket.createdAt, i18n.locale)}
            </time>
            {ticket.images.length > 0 && (
              <small>
                <Icon name="image" />
                {ticket.images.length}{" "}
                {ticket.images.length === 1
                  ? i18n("captura")
                  : i18n("capturas")}
              </small>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
