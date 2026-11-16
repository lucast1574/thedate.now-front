import { useTranslator } from "@/lib/i18n/react";
import Listbox from "@/components/listbox";
import { useState } from "react";
import { fullName } from "@/lib/events/attendees";
import { surnameOrder } from "@/lib/events/auto-seating";
import type { Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";
import GuestRosterRow from "./guest-roster-row";
import { useClock } from "@/components/use-clock";
export default function GuestRoster({
  guests,
  plan,
  enabled,
  eventId,
  onUpdated,
  blocked,
}: {
  guests: Guest[];
  plan: SeatingPlan;
  enabled?: boolean;
  eventId?: string;
  onUpdated?: () => Promise<void>;
  blocked?: boolean;
}) {
  const i18n = useTranslator();

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
        <h3>{i18n("Tu lista empieza aquí")}</h3>
        <p>
          {i18n(
            "Sube tu archivo o añade el primer invitado. Después verás aquí el orden, los envíos y cada respuesta.",
          )}
        </p>
      </div>
    );
  return (
    <section id="guest-list" tabIndex={-1} className="roster">
      <header className="roster-heading">
        <h3>{i18n("Tu lista de invitados")}</h3>
        <p>
          {i18n(
            "El orden de invitación se conserva aunque consultes la lista por apellido.",
          )}
        </p>
      </header>
      <div className="roster-controls">
        <label>
          {i18n("Buscar invitado o familia")}{" "}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={i18n("Nombre, apellido o teléfono")}
          />
        </label>
        <label>
          {i18n("Respuesta")}{" "}
          <Listbox value={filter} onValueChange={(value) => setFilter(value)}>
            <option value="all">{i18n("Todas")}</option>
            <option value="going">{i18n("Aceptaron")}</option>
            <option value="not_going">{i18n("No asistirán")}</option>
            <option value="maybe">{i18n("Pidieron tiempo")}</option>
            <option value="pending">{i18n("Sin respuesta")}</option>
          </Listbox>
        </label>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? i18n("Ver orden de invitación") : i18n("Ver por apellido")}
        </button>
      </div>
      <p>
        {list.length}{" "}
        {list.length === 1 ? i18n("invitación") : i18n("invitaciones")}
        {i18n(". Cada acompañante aparece por separado y ocupa un asiento.")}
      </p>
      <div className="roster-table">
        <table>
          <thead>
            <tr>
              <th>{i18n("Invitación / personas")}</th>
              <th>{i18n("Respuesta")}</th>
              <th>{i18n("Cupos")}</th>
              <th>{i18n("Mesa")}</th>
              <th>{i18n("Regalo")}</th>
              <th>{i18n("Contacto")}</th>
              {eventId && <th>{i18n("Acciones")}</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((g, index) => (
              <GuestRosterRow
                key={g.id}
                g={g}
                index={index}
                showPosition={!sorted && !search && filter === "all"}
                plan={plan}
                enabled={enabled}
                now={now}
                eventId={eventId}
                onUpdated={onUpdated}
                blocked={blocked}
              />
            ))}
          </tbody>
        </table>
        {!list.length && <p>{i18n("No hay invitados con este filtro.")}</p>}
      </div>
    </section>
  );
}
