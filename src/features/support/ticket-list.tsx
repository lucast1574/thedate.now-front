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
              {ticketStateLabel(ticket.state)}
            </span>
            <strong>{ticket.title}</strong>
            {ticket.requester && <span>{ticket.requester.name}</span>}
            <time dateTime={ticket.createdAt}>
              {ticketDate(ticket.createdAt)}
            </time>
            {ticket.images.length > 0 && (
              <small>
                <Icon name="image" />
                {ticket.images.length}{" "}
                {ticket.images.length === 1 ? "captura" : "capturas"}
              </small>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
