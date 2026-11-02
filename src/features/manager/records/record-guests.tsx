import { useState } from "react";
import { fullName, partySeats } from "@/lib/events/attendees";
import type { Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";

const responses: Record<string, string> = {
  going: "Confirmó",
  not_going: "Declinó",
  maybe: "Sin confirmar",
  pending: "Sin respuesta",
};
export default function RecordGuests({
  guests,
  plan,
}: {
  guests: Guest[];
  plan: SeatingPlan;
}) {
  const [search, setSearch] = useState("");
  const confirmed = guests
    .filter((guest) => guest.response === "going")
    .reduce((total, guest) => total + partySeats(guest), 0);
  const list = guests.filter((guest) =>
    `${fullName(guest)} ${guest.companions?.map(fullName).join(" ") || ""}`
      .toLocaleLowerCase("es")
      .includes(search.toLocaleLowerCase("es")),
  );
  return (
    <>
      <p className="record-summary">
        {guests.length} {guests.length === 1 ? "invitación" : "invitaciones"} ·{" "}
        {confirmed}{" "}
        {confirmed === 1 ? "persona confirmada" : "personas confirmadas"}
      </p>
      {guests.length > 8 && (
        <label className="record-search">
          Buscar por nombre
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre o apellido"
          />
        </label>
      )}
      {!guests.length ? (
        <p className="record-empty">No hay invitados en esta lista.</p>
      ) : (
        <div className="record-table-scroll">
          <table className="record-table">
            <thead>
              <tr>
                <th>Invitado</th>
                <th>Respuesta</th>
                <th>Personas</th>
                <th>Mesa</th>
              </tr>
            </thead>
            <tbody>
              {list.map((guest) => (
                <tr key={guest.id}>
                  <td>
                    <strong>{fullName(guest)}</strong>
                    {guest.companions?.length ? (
                      <small>{guest.companions.map(fullName).join(", ")}</small>
                    ) : null}
                  </td>
                  <td data-label="Respuesta">
                    {responses[guest.response] || "Sin respuesta"}
                  </td>
                  <td data-label="Personas">{partySeats(guest)}</td>
                  <td data-label="Mesa">
                    {plan.tables.find(
                      (table) => table.id === plan.assignments[`${guest.id}~0`],
                    )?.name || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && (
            <p className="record-empty">No hay coincidencias.</p>
          )}
        </div>
      )}
    </>
  );
}
