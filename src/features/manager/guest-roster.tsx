import Listbox from "@/components/listbox";
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
  enabled,
}: {
  guests: Guest[];
  plan: SeatingPlan;
  enabled?: boolean;
}) {
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [sorted, setSorted] = useState(false);
  const now = useClock();
  const list = guests.filter(
    (g) =>
      (filter === "all" || g.response === filter) &&
      `${fullName(g)} ${g.family || ""} ${g.phone} ${g.companions?.map(fullName).join(" ") || ""}`
        .toLocaleLowerCase("es")
        .includes(search.toLocaleLowerCase("es")),
  );
  if (sorted) list.sort(surnameOrder);
  else
    list.sort(
      (a, b) =>
        (a.queuePosition || 0) - (b.queuePosition || 0) ||
        (Date.parse(a.createdAt || "") || 0) -
          (Date.parse(b.createdAt || "") || 0),
    );
  if (!guests.length)
    return (
      <div id="guest-list" tabIndex={-1} className="guest-roster-empty">
        <h3>Tu lista empieza aquí</h3>
        <p>
          Sube tu archivo o añade el primer invitado. Después verás aquí el
          orden, los envíos y cada respuesta.
        </p>
      </div>
    );
  return (
    <section id="guest-list" tabIndex={-1} className="roster">
      <header className="roster-heading">
        <h3>Tu lista de invitados</h3>
        <p>
          El orden de invitación se conserva aunque consultes la lista por
          apellido.
        </p>
      </header>
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
          <Listbox value={filter} onValueChange={(value) => setFilter(value)}>
            <option value="all">Todas</option>
            <option value="going">Aceptaron</option>
            <option value="not_going">No asistirán</option>
            <option value="maybe">Pidieron tiempo</option>
            <option value="pending">Sin respuesta</option>
          </Listbox>
        </label>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ver orden de invitación" : "Ver por apellido"}
        </button>
      </div>
      <p>
        {list.length} {list.length === 1 ? "invitación" : "invitaciones"}. Cada
        acompañante aparece por separado y ocupa un asiento.
      </p>
      <div className="roster-table">
        <table>
          <thead>
            <tr>
              <th>Invitación / personas</th>
              <th>Respuesta</th>
              <th>Cupos</th>
              <th>Mesa</th>
              <th>Regalo</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            {list.map((g, index) => (
              <tr key={g.id}>
                <td>
                  {!sorted && !search && filter === "all" && (
                    <span className="guest-queue-position">{index + 1}</span>
                  )}
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
                  <small>Máximo {g.seats}</small>
                </td>
                <td>
                  {g.response !== "going" ? (
                    <small>
                      {g.response === "not_going"
                        ? "No asistirá"
                        : "Se asignará al confirmar"}
                    </small>
                  ) : (
                    <small>
                      {plan.tables.find(
                        (t) => t.id === plan.assignments[`${g.id}~0`],
                      )?.name || "Sin mesa"}
                    </small>
                  )}
                </td>
                <td>
                  {g.gift ? (
                    <>
                      <strong>{g.gift.title}</strong>
                      <small>
                        {g.gift.delivered
                          ? "Recibido"
                          : "Se comprometió a regalarlo"}
                      </small>
                    </>
                  ) : (
                    <small>Sin elección</small>
                  )}
                </td>
                <td>
                  {g.phone}
                  <br />
                  {g.sentAt && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={g.invitationUrl}
                    >
                      Enlace personal ↗
                    </a>
                  )}
                  <small>
                    {g.sentAt
                      ? "WhatsApp enviado"
                      : g.sendState === "sending"
                        ? "Enviando…"
                        : g.sendState === "unknown"
                          ? "Envío por verificar"
                          : g.sendState === "failed"
                            ? "No se pudo enviar"
                            : enabled
                              ? "Esperando su turno"
                              : "Por enviar"}
                  </small>
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
