import type { Attendee } from "./seating";
import type { Guest } from "./types";
export function fullName(person: { name: string; lastName?: string }) {
  return [person.name, person.lastName].filter(Boolean).join(" ");
}
export function partySeats(guest: Guest) {
  return guest.attendingSeats || guest.seats;
}
export function attendees(guests: Guest[]): Attendee[] {
  return guests.flatMap((guest) =>
    Array.from({ length: partySeats(guest) }, (_, slot) => {
      const person = slot === 0 ? guest : guest.companions?.[slot - 1];
      return {
        id: `${guest.id}~${slot}`,
        guestId: guest.id,
        slot,
        name: person?.name || "Acompañante pendiente",
        lastName: person?.lastName || "",
        gender: person?.gender || "unspecified",
        family: guest.family || "",
        response: guest.response,
        registered: Boolean(person),
      };
    }),
  );
}
export function responseLabel(guest: Guest, now = Date.now()) {
  if (guest.response === "going") return "Confirmado";
  if (guest.response === "not_going") return "No asistirá";
  if (guest.response === "maybe")
    return guest.maybeExpiresAt &&
      new Date(guest.maybeExpiresAt).getTime() <= now
      ? "Espera vencida"
      : "Pidió tiempo";
  return "Sin respuesta";
}
export function guestStats(guests: Guest[], now: number) {
  const confirmed = guests
    .filter((g) => g.response === "going")
    .reduce((sum, g) => sum + partySeats(g), 0);
  const held = guests
    .filter(
      (g) =>
        g.response === "maybe" &&
        g.maybeExpiresAt &&
        new Date(g.maybeExpiresAt).getTime() > now,
    )
    .reduce((sum, g) => sum + partySeats(g), 0);
  return {
    confirmed,
    held,
    declined: guests.filter((g) => g.response === "not_going").length,
    pending: guests.filter((g) => !g.response || g.response === "pending")
      .length,
    invited: guests.reduce((sum, g) => sum + g.seats, 0),
  };
}
