"use client";
import Icon from "@/components/icon";
import Alert from "@/components/alert";
import { useCollaborationAccess } from "./use-collaboration-access";
export default function CoupleAccess({
  eventId,
  wedding,
}: {
  eventId: string;
  wedding: boolean;
}) {
  const state = useCollaborationAccess(eventId);
  return (
    <section className="shared-invite-panel">
      <Icon name="users" />
      <h2>
        {wedding ? "Un lugar para los dos" : "Invita a sus protagonistas"}
      </h2>
      <p>
        {wedding
          ? "Añade los correos de los novios y acompañad juntos cada detalle de su boda."
          : "Añade hasta dos personas para que puedan diseñar y planificar contigo."}{" "}
        Pueden usar su correo de Google para entrar directamente.
      </p>
      <Alert>{state.error}</Alert>
      <Alert variant="success">{state.notice}</Alert>
      {state.access && (
        <p className="shared-slot-count">
          {state.remaining} de {state.access.limit} accesos disponibles
        </p>
      )}
      {state.access?.members.map((member) => (
        <div className="access-row" key={member.id}>
          <span className="shared-member-avatar">
            {member.name.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{member.name}</strong>
            <small>{member.email} · Acceso activo</small>
          </span>
          <button
            type="button"
            disabled={state.busy}
            onClick={() => void state.remove(member.id)}
          >
            Retirar acceso
          </button>
        </div>
      ))}
      {state.access?.pending.map((invite) => (
        <div className="access-row" key={invite.id}>
          <Icon name="mail" />
          <span>
            <strong>{invite.email}</strong>
            <small>
              {invite.delivery === "sent"
                ? "Invitación enviada"
                : invite.delivery === "failed"
                  ? "Envío fallido"
                  : "Entrega sin confirmar"}{" "}
              · vence {new Date(invite.expiresAt).toLocaleDateString("es-PE")}
            </small>
          </span>
          <button
            type="button"
            disabled={state.busy}
            onClick={() => void state.remove(invite.id)}
          >
            Retirar invitación
          </button>
        </div>
      ))}
      {state.remaining > 0 && (
        <form onSubmit={state.invite}>
          <div className="shared-email-grid">
            {[0, 1].slice(0, state.remaining).map((index) => (
              <label key={index}>
                {wedding
                  ? index === 0
                    ? "Primer correo de la pareja"
                    : "Segundo correo de la pareja"
                  : `Correo de la persona ${index + 1}`}
                <input
                  type="email"
                  autoComplete="off"
                  disabled={state.busy}
                  value={state.emails[index]}
                  placeholder={
                    index === 0 ? "persona@gmail.com" : "otra.persona@gmail.com"
                  }
                  onChange={(e) =>
                    state.setEmails((current) =>
                      current.map((email, n) =>
                        n === index ? e.target.value : email,
                      ),
                    )
                  }
                />
              </label>
            ))}
          </div>
          <button
            className="office-button"
            disabled={state.busy || !state.access?.emailConfigured}
          >
            {state.busy ? "Enviando…" : "Enviar invitaciones"}
            <Icon name="arrow" />
          </button>
        </form>
      )}
      {state.access && !state.access.emailConfigured && (
        <p>El envío por correo aún no está configurado.</p>
      )}
      {!state.remaining && state.access && (
        <p>
          Los dos accesos ya están asignados. Puedes retirar uno para invitar a
          otra persona.
        </p>
      )}
      <div className="shared-access-notes">
        <Icon name="lock" />
        <p>
          Cada persona entra con su propia cuenta y solo accede a esta
          celebración: diseño, invitados, mesas y regalos. Tú mantienes la
          propiedad y los pagos.
        </p>
      </div>
    </section>
  );
}
