"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import Brand from "@/components/brand";
import Alert from "@/components/alert";
import AuthPanel from "@/features/studio/auth-panel";
import type { AccountFields, AuthMode, User } from "@/lib/events/types";
type Invite = {
  email: string;
  eventTitle: string;
  kind: "wedding" | "general";
  studioUrl: string;
};
export default function Join({
  token,
  googleEnabled,
}: {
  token: string;
  googleEnabled: boolean;
}) {
  const [invite, setInvite] = useState<Invite | null>(null),
    [user, setUser] = useState<User | null>(null),
    [message, setMessage] = useState(""),
    [accepted, setAccepted] = useState(false),
    [eventId, setEventId] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    api<Invite>(`/api/join/${token}`)
      .then((i) => {
        if (active) setInvite(i);
      })
      .catch(() => {
        if (active) setMessage("Esta invitación ya no está disponible.");
      });
    api<User>("/api/session")
      .then((u) => {
        if (active) setUser(u);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [token]);
  async function signIn(fields: AccountFields, mode: AuthMode) {
    setBusy(true);
    setMessage("");
    try {
      const result = await api<{ user: User }>("/api/session", "POST", {
        ...fields,
        action: mode,
        role: invite?.kind === "wedding" ? "planner" : "organizer",
      });
      setUser(result.user);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function accept() {
    setBusy(true);
    setMessage("");
    try {
      const result = await api<{ eventId: string }>(
        `/api/join/${token}`,
        "POST",
      );
      setEventId(result.eventId);
      setAccepted(true);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const wedding = invite?.kind === "wedding";
  return (
    <main className={`office ${wedding ? "office-wedding" : "office-general"}`}>
      <header className="office-header">
        <a href={wedding ? "https://save.thedate.now" : "https://thedate.now"}>
          <Brand wedding={wedding} />
        </a>
      </header>
      <section className="join-intro">
        <p className="office-kicker">UNA INVITACIÓN PARA CREAR JUNTOS</p>
        <h1>
          {accepted
            ? "Ya eres parte."
            : wedding
              ? "Su historia, en sus manos."
              : "Hagamos que suceda."}
        </h1>
        {invite && (
          <p>
            Te invitaron a colaborar en <strong>{invite.eventTitle}</strong> con{" "}
            <strong>{invite.email}</strong>. Tendrás acceso al diseño, invitados
            y mesas de este evento. Tu cuenta también te permite crear tus
            propios eventos.
          </p>
        )}
        <Alert>{message}</Alert>
        {accepted && (
          <a
            className="office-button"
            href={`${invite?.studioUrl}/?event=${encodeURIComponent(eventId)}`}
          >
            Entrar al evento ↗
          </a>
        )}
        {invite &&
          !accepted &&
          (!user ? (
            <AuthPanel
              key={invite.email}
              wedding={wedding}
              googleEnabled={googleEnabled}
              busy={busy}
              error={message}
              initialEmail={invite.email}
              googleNext={`/join/${token}`}
              onClearError={() => setMessage("")}
              onSignIn={signIn}
            />
          ) : (
            <>
              <p>Sesión: {user.email}</p>
              {user.email === invite.email ? (
                <button
                  className="office-button"
                  disabled={busy}
                  onClick={() => void accept()}
                >
                  Aceptar acceso a este evento
                </button>
              ) : (
                <button
                  className="office-button"
                  onClick={() =>
                    void api("/api/session", "DELETE").then(() => setUser(null))
                  }
                >
                  Entrar con el correo invitado
                </button>
              )}
            </>
          ))}
      </section>
    </main>
  );
}
