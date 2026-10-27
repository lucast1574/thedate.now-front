"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AccountShell from "@/features/account/account-shell";
import ProfessionalUpgrade from "./professional-upgrade";
import CoupleAccess from "./couple-access";
import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import Alert from "@/components/alert";
import { api } from "@/lib/api/client";
import type { Event, User } from "@/lib/events/types";
export default function SharedCelebrations({
  wedding,
  googleEnabled,
}: {
  wedding: boolean;
  googleEnabled: boolean;
}) {
  return (
    <AccountShell
      wedding={wedding}
      googleEnabled={googleEnabled}
      active="collaboration"
      next="/compartir"
    >
      {(user, update) =>
        user.role === "admin" ||
        user.role === (wedding ? "planner" : "organizer") ? (
          <SharedWorkspace user={user} wedding={wedding} />
        ) : (
          <ProfessionalUpgrade wedding={wedding} onUpgrade={update} />
        )
      }
    </AccountShell>
  );
}
function SharedWorkspace({ user, wedding }: { user: User; wedding: boolean }) {
  const [events, setEvents] = useState<Event[]>([]),
    [selected, setSelected] = useState(""),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api<Event[]>("/api/backend/events")
      .then((list) => {
        if (active)
          setEvents(
            list.filter(
              (e) =>
                e.kind === (wedding ? "wedding" : "general") &&
                !e.isDemo &&
                e.paymentStatus === "paid" &&
                (e.ownerId === user.id || user.role === "admin"),
            ),
          );
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [wedding, user.id, user.role]);
  const event = events.find((e) => e.id === selected) || events[0];
  return (
    <section className="shared-celebrations">
      <header className="shared-heading">
        <p className="office-kicker">TU ESPACIO PROFESIONAL</p>
        <h1>
          {wedding
            ? "Su historia. Un mismo equipo."
            : "Grandes planes, en equipo."}
        </h1>
        <p>
          {wedding
            ? "Conecta cada boda con sus protagonistas. Tú coordinas; ellos aportan su historia."
            : "Asigna cada celebración a sus protagonistas y organizad juntos cada detalle."}
        </p>
      </header>
      <div className="shared-journey">
        {[
          ["check", "1 · Elige una celebración pagada"],
          ["users", "2 · Añade sus dos correos"],
          ["heart", "3 · Planificad juntos"],
        ].map(([icon, label]) => (
          <span key={label}>
            <Icon name={icon} />
            {label}
          </span>
        ))}
      </div>
      <Alert>{error}</Alert>
      {!loaded ? (
        <p role="status">Preparando tus celebraciones…</p>
      ) : event ? (
        <div className="shared-workbench">
          <aside className="shared-event-card">
            <span className="shared-paid">
              <Icon name="check" />
              Lista para compartir
            </span>
            <label>
              {wedding ? "Selecciona la boda" : "Selecciona el evento"}
              <Listbox value={event.id} onValueChange={setSelected}>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </Listbox>
            </label>
            <h2>{event.title}</h2>
            <p>{event.location}</p>
            <Link href={`/editor/${event.id}`}>
              Abrir su invitación <Icon name="external" />
            </Link>
            <small>
              Cada celebración conserva su propio equipo. Puedes gestionar
              tantas bodas o eventos como necesites.
            </small>
          </aside>
          <CoupleAccess key={event.id} eventId={event.id} wedding={wedding} />
        </div>
      ) : (
        <SharingDemo wedding={wedding} />
      )}
    </section>
  );
}
export function SharingDemo({ wedding }: { wedding: boolean }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="shared-workbench shared-demo">
      <aside className="shared-event-card">
        <span className="shared-paid">Vista de ejemplo</span>
        <h2>{wedding ? "Sofía y Mateo" : "La gran celebración"}</h2>
        <p>
          Así acompañarás a tus clientes, desde la primera idea hasta el último
          detalle.
        </p>
        <Link className="office-button" href="/?new=1">
          {wedding ? "Crear mi primera boda" : "Crear mi primer evento"}
          <Icon name="arrow" />
        </Link>
        <small>
          Esta función se habilita para cada celebración después de pagarla.
        </small>
      </aside>
      <section className="shared-invite-panel">
        <Icon name="users" />
        <h2>
          {wedding ? "Un lugar para los dos" : "Invita a sus protagonistas"}
        </h2>
        <p>
          Prueba el recorrido. Los correos de esta demo no se envían ni se
          guardan.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="shared-email-grid">
            {[1, 2].map((n) => (
              <label key={n}>
                Correo de la persona {n}
                <input
                  type="email"
                  placeholder={n === 1 ? "sofia@gmail.com" : "mateo@gmail.com"}
                />
              </label>
            ))}
          </div>
          <button className="office-button">
            Probar invitación <Icon name="arrow" />
          </button>
        </form>
        {sent && (
          <p role="status" className="shared-success">
            <Icon name="check" />
            Así de fácil. En una celebración pagada recibirán un correo para
            entrar con su propia cuenta.
          </p>
        )}
        <div className="shared-access-notes">
          <Icon name="lock" />
          <p>
            Entran con Google o con su cuenta. Solo ven la celebración asignada,
            con acceso al diseño, invitados, mesas y regalos.
          </p>
        </div>
      </section>
    </div>
  );
}
