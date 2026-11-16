"use client";
import { useTranslator } from "@/lib/i18n/react";

import Icon from "@/components/icon";
import Alert from "@/components/alert";
import { useCollaborationAccess } from "./use-collaboration-access";
export default function CoupleAccess({
  eventId,
  wedding,
  readOnly = false,
}: {
  eventId: string;
  wedding: boolean;
  readOnly?: boolean;
}) {
  const i18n = useTranslator();

  const state = useCollaborationAccess(eventId);
  return (
    <section className="shared-invite-panel">
      <Icon name="users" />
      <h2>
        {wedding
          ? i18n("Un lugar para los dos")
          : i18n("Invita a sus protagonistas")}
      </h2>
      <p>
        {wedding
          ? i18n(
              "Añade los correos de los novios y acompañad juntos cada detalle de su boda.",
            )
          : i18n(
              "Añade hasta dos personas para que puedan diseñar y planificar contigo.",
            )}{" "}
        {i18n("Pueden usar su correo de Google para entrar directamente.")}
      </p>
      <Alert>{state.error}</Alert>
      <Alert variant="success">{state.notice}</Alert>
      {state.access && (
        <p className="shared-slot-count">
          {state.remaining} {i18n("de")} {state.access.limit}{" "}
          {i18n("accesos disponibles")}
        </p>
      )}
      {state.access?.members.map((member) => (
        <div className="access-row" key={member.id}>
          <span className="shared-member-avatar">
            {member.name.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{member.name}</strong>
            <small>
              {member.email} {i18n("· Acceso activo")}
            </small>
          </span>
          {!readOnly && (
            <button
              type="button"
              disabled={state.busy}
              onClick={() => void state.remove(member.id)}
            >
              {i18n("Retirar acceso")}
            </button>
          )}
        </div>
      ))}
      {state.access?.pending.map((invite) => (
        <div className="access-row" key={invite.id}>
          <Icon name="mail" />
          <span>
            <strong>{invite.email}</strong>
            <small>
              {invite.delivery === "sent"
                ? i18n("Invitación enviada")
                : invite.delivery === "failed"
                  ? i18n("Envío fallido")
                  : i18n("Entrega sin confirmar")}{" "}
              {i18n("· vence")}{" "}
              {new Date(invite.expiresAt).toLocaleDateString(i18n.locale)}
            </small>
          </span>
          {!readOnly && (
            <button
              type="button"
              disabled={state.busy}
              onClick={() => void state.remove(invite.id)}
            >
              {i18n("Retirar invitación")}
            </button>
          )}
        </div>
      ))}
      {!readOnly && state.remaining > 0 && (
        <form onSubmit={state.invite}>
          <div className="shared-email-grid">
            {[0, 1].slice(0, state.remaining).map((index) => (
              <label key={index}>
                {wedding
                  ? index === 0
                    ? i18n("Primer correo de la pareja")
                    : i18n("Segundo correo de la pareja")
                  : i18n("Correo de la persona {v0}", { v0: index + 1 })}
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
          {!readOnly && (
            <button
              className="office-button"
              disabled={state.busy || !state.access?.emailConfigured}
            >
              {state.busy ? i18n("Enviando…") : i18n("Enviar invitaciones")}
              <Icon name="arrow" />
            </button>
          )}
        </form>
      )}
      {state.access && !state.access.emailConfigured && (
        <p>{i18n("El envío por correo aún no está configurado.")}</p>
      )}
      {!state.remaining && state.access && (
        <p>
          {i18n(
            "Los dos accesos ya están asignados. Puedes retirar uno para invitar a otra persona.",
          )}
        </p>
      )}
      <div className="shared-access-notes">
        <Icon name="lock" />
        <p>
          {i18n(
            "Cada persona entra con su propia cuenta y solo accede a esta celebración: diseño, invitados, mesas y regalos. Tú mantienes la propiedad y los pagos.",
          )}
        </p>
      </div>
    </section>
  );
}
