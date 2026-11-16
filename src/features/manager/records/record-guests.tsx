import { useTranslator } from "@/lib/i18n/react";
import { type Translator, localized } from "@/lib/i18n/translator";
import { useState } from "react";
import { fullName, partySeats } from "@/lib/events/attendees";
import type { Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";

const responses = localized((i18n: Translator): Record<string, string> => ({
  going: i18n("Confirmó"),
  not_going: i18n("Declinó"),
  maybe: i18n("Sin confirmar"),
  pending: i18n("Sin respuesta"),
}));
export default function RecordGuests({
  guests,
  plan,
}: {
  guests: Guest[];
  plan: SeatingPlan;
}) {
  const i18n = useTranslator();

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
        {guests.length}{" "}
        {guests.length === 1 ? i18n("invitación") : i18n("invitaciones")} ·{" "}
        {confirmed}{" "}
        {confirmed === 1
          ? i18n("persona confirmada")
          : i18n("personas confirmadas")}
      </p>
      {guests.length > 8 && (
        <label className="record-search">
          {i18n("Buscar por nombre")}{" "}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={i18n("Nombre o apellido")}
          />
        </label>
      )}
      {!guests.length ? (
        <p className="record-empty">
          {i18n("No hay invitados en esta lista.")}
        </p>
      ) : (
        <div className="record-table-scroll">
          <table className="record-table">
            <thead>
              <tr>
                <th>{i18n("Invitado")}</th>
                <th>{i18n("Respuesta")}</th>
                <th>{i18n("Personas")}</th>
                <th>{i18n("Mesa")}</th>
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
                    {responses(i18n)[guest.response] || i18n("Sin respuesta")}
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
            <p className="record-empty">{i18n("No hay coincidencias.")}</p>
          )}
        </div>
      )}
    </>
  );
}
