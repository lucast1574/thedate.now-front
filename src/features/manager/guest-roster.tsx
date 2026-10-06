import { useState } from "react";
import {
  attendees,
  fullName,
  partySeats,
  responseLabel,
} from "@/lib/events/attendees";
import { surnameOrder } from "@/lib/events/auto-seating";
import type { Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";
import PersonGlyph from "@/components/person-glyph";
import { useClock } from "@/components/use-clock";
export default function GuestRoster({
  guests,
  plan,
}: {
  guests: Guest[];
  plan: SeatingPlan;
}) {
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [sorted, setSorted] = useState(true);
  const now = useClock();
  const list = guests.filter(
    (g) =>
      (filter === "all" || g.response === filter) &&
      `${fullName(g)} ${g.family || ""} ${g.phone} ${g.companions?.map(fullName).join(" ") || ""}`
        .toLocaleLowerCase("es")
        .includes(search.toLocaleLowerCase("es")),
  );
  if (sorted) list.sort(surnameOrder);
  return (
    <section className="roster">
      <div className="roster-controls">
        <label>
          Buscar invitado o familia
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, apellido o teléfono"
          />
        </label>
        <label>
          Respuesta
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todas</option>
            <option value="going">Aceptaron</option>
            <option value="not_going">No asistirán</option>
            <option value="maybe">Pidieron tiempo</option>
            <option value="pending">Sin respuesta</option>
          </select>
        </label>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Orden: apellido ✓" : "Ordenar por apellido"}
        </button>
      </div>
      <p>
        {list.length} invitaciones. Cada acompañante aparece por separado y
        ocupa un asiento.
      </p>
      <div className="roster-table">
        <table>
          <thead>
            <tr>
              <th>Invitación / personas</th>
              <th>Respuesta</th>
              <th>Cupos</th>
              <th>Mesa</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            {list.map((g) => (
              <tr key={g.id}>
                <td>
                  <strong>{fullName(g)}</strong>
                  {g.family && <small>{g.family}</small>}
                  <ul className="party-names">
                    {attendees([g]).map((p) => (
                      <li key={p.id}>
                        <PersonGlyph gender={p.gender} />
                        <span>
                          {fullName(p)}
                          {p.slot ? ` (+${p.slot})` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <span className={`response-pill response-${g.response}`}>
                    {responseLabel(g, now)}
                  </span>
                  {g.maybeReason && <small>{g.maybeReason}</small>}
                  {g.maybeExpiresAt && (
                    <small>
                      Reserva hasta{" "}
                      {new Date(g.maybeExpiresAt).toLocaleString("es-PE")}
                    </small>
                  )}
                </td>
                <td>
                  {partySeats(g)} {partySeats(g) === 1 ? "persona" : "personas"}
                  <br />
                  <small>Máximo {g.seats}</small>
                </td>
                <td>
                  {attendees([g]).map((p) => (
                    <small key={p.id}>
                      {plan.tables.find((t) => t.id === plan.assignments[p.id])
                        ?.name || "Sin mesa"}
                      {p.slot ? ` · +${p.slot}` : ""}
                    </small>
                  ))}
                </td>
                <td>
                  {g.phone}
                  <br />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={g.invitationUrl}
                  >
                    Enlace personal ↗
                  </a>
                  <small>{g.sentAt ? "WhatsApp enviado" : "Sin enviar"}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p>No hay invitados con este filtro.</p>}
      </div>
    </section>
  );
}
