import Link from "next/link";
import { partySeats } from "@/lib/events/attendees";
import { useClock } from "@/components/use-clock";
import type { Event, Guest, GuestFields } from "@/lib/events/types";
import GuestImport from "./guest-import";
import GuestForm from "./guest-form";
import GuestList from "./guest-list";
export default function GuestPanel({
  selected,
  guests,
  busy,
  onAdd,
  onImported,
  sendInvitations,
}: {
  selected: Event;
  guests: Guest[];
  busy: boolean;
  onImported: () => Promise<void>;
  onAdd: (fields: GuestFields) => Promise<boolean>;
  sendInvitations: () => void;
}) {
  const now = useClock();
  const occupied = guests
    .filter(
      (x) =>
        x.response === "going" ||
        (x.response === "maybe" &&
          x.maybeExpiresAt &&
          new Date(x.maybeExpiresAt).getTime() > now),
    )
    .reduce((sum, x) => sum + partySeats(x), 0);
  if (selected.paymentStatus !== "paid")
    return (
      <section className="guest-locked">
        <h2>Invitados y WhatsApp</h2>
        <p>
          Guarda y previsualiza tu diseño gratis. Paga para habilitar la lista
          de invitados y publicar tu invitación; después podrás enviarla por
          WhatsApp.
        </p>
      </section>
    );
  return (
    <>
      <div className="office-divider" />
      <div className="action-row">
        <div>
          <p className="office-kicker">LISTA DE INVITADOS</p>
          <h2>Confirmaciones</h2>
        </div>
        <div className="seat-stat">
          <strong>{occupied}</strong>
          <span>
            / {selected.capacityUnlimited ? "sin límite" : selected.capacity}{" "}
            cupos reservados
          </span>
        </div>
      </div>
      {selected.publishedAt && (
        <button
          className="send-button"
          disabled={busy || guests.every((g) => !!g.sentAt)}
          onClick={sendInvitations}
        >
          Enviar invitaciones por WhatsApp ↗
        </button>
      )}
      <p className="guest-hint">
        Cada persona recibe su propio enlace para responder. Puedes copiarlo
        antes de enviar WhatsApp.
      </p>
      <Link className="office-button" href={`/manager/${selected.id}`}>
        Abrir gestor de invitados y plano de mesas ↗
      </Link>
      <GuestForm busy={busy} onAdd={onAdd} />
      <GuestImport eventId={selected.id} onImported={onImported} />
      <GuestList guests={guests} />
    </>
  );
}
