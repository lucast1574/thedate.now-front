"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api/client";
import Alert from "@/components/alert";
type Member = { id: string; name: string; email: string };
type Pending = {
  id: string;
  email: string;
  delivery: string;
  expiresAt: string;
};
type Access = {
  members: Member[];
  pending: Pending[];
  limit: number;
  emailConfigured: boolean;
};
export default function CoupleAccess({
  eventId,
  wedding,
}: {
  eventId: string;
  wedding: boolean;
}) {
  const [access, setAccess] = useState<Access | null>(null),
    [email, setEmail] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const load = useCallback(
    () =>
      api<Access>(`/api/backend/events/${eventId}/collaborators`).then(
        setAccess,
      ),
    [eventId],
  );
  useEffect(() => {
    let active = true;
    api<Access>(`/api/backend/events/${eventId}/collaborators`)
      .then((a) => {
        if (active) setAccess(a);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [eventId]);
  async function invite(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api<{ delivery: string }>(
        `/api/backend/events/${eventId}/collaborators`,
        "POST",
        { email },
      );
      setEmail("");
      setNotice(
        result.delivery === "sent"
          ? "Correo enviado. El enlace dura siete días."
          : result.delivery === "failed"
            ? "El correo no pudo enviarse. Retira esta invitación antes de intentarlo de nuevo."
            : "El servidor de correo no confirmó el envío. Comprueba con el destinatario antes de retirar o reenviar.",
      );
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    setBusy(true);
    setError("");
    try {
      await api(`/api/backend/events/${eventId}/collaborators/${id}`, "DELETE");
      await load();
      setNotice("Acceso retirado.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const full =
    access && access.members.length + access.pending.length >= access.limit;
  return (
    <section className="couple-access">
      <div className="office-divider" />
      <p className="office-kicker">
        {wedding ? "PLANEEN JUNTOS" : "TU EQUIPO"}
      </p>
      <h2>Comparte este {wedding ? "día" : "evento"}.</h2>
      <p>
        Invita a dos personas por correo. Cada una usa su propia cuenta y solo
        accede a este evento: diseño, invitados y mesas. También podrá crear sus
        propios eventos independientes.
      </p>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      {access?.members.map((m) => (
        <div className="access-row" key={m.id}>
          <span>
            <strong>{m.name}</strong>
            <small>{m.email}</small>
          </span>
          <button disabled={busy} onClick={() => void remove(m.id)}>
            Retirar acceso
          </button>
        </div>
      ))}
      {access?.pending.map((i) => (
        <div className="access-row" key={i.id}>
          <span>
            {i.email}
            <small>
              Pendiente ·{" "}
              {i.delivery === "sent"
                ? "correo enviado"
                : i.delivery === "failed"
                  ? "envío fallido"
                  : "envío sin confirmar"}{" "}
              · vence {new Date(i.expiresAt).toLocaleDateString("es-PE")}
            </small>
          </span>
          <button disabled={busy} onClick={() => void remove(i.id)}>
            Retirar invitación
          </button>
        </div>
      ))}
      <form onSubmit={invite}>
        <label>
          Correo de quien te acompañará
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          className="office-button"
          disabled={busy || Boolean(full) || !access?.emailConfigured}
        >
          Enviar invitación por correo
        </button>
      </form>
      {full && (
        <p>
          Los dos accesos están ocupados. Puedes retirar uno para invitar a otra
          persona.
        </p>
      )}
      {access && !access.emailConfigured && (
        <p>El envío de correo aún no está configurado.</p>
      )}
    </section>
  );
}
