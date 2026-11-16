"use client";
import { useTranslator } from "@/lib/i18n/react";

import Alert from "@/components/alert";
import ActionButton from "@/components/action-button";
import { useState, type FormEvent } from "react";
import GoogleIcon from "@/components/google-icon";
import type { AccountFields, AuthMode } from "@/lib/events/types";
export default function AuthPanel({
  wedding,
  googleEnabled,
  busy,
  error,
  onSignIn,
  onClearError,
  initialEmail = "",
  googleNext = "/",
  context = "studio",
}: {
  context?: "studio" | "invitation";
  initialEmail?: string;
  googleNext?: string;
  wedding: boolean;
  googleEnabled: boolean;
  busy: boolean;
  error: string;
  onSignIn: (form: AccountFields, mode: AuthMode) => Promise<void>;
  onClearError: () => void;
}) {
  const i18n = useTranslator();

  const otherPortal = wedding
    ? "https://crea.thedate.now"
    : "https://studio.save.thedate.now";
  const [mode, setMode] = useState<AuthMode>("login");
  const invitation = context === "invitation";
  const googleLink = `/api/auth/google/start?${new URLSearchParams({
    next: googleNext,
    ...(invitation && initialEmail ? { email: initialEmail } : {}),
  })}`;
  const [form, setForm] = useState<AccountFields>({
    name: "",
    email: initialEmail,
    password: "",
  });
  async function submit(e: FormEvent) {
    e.preventDefault();
    await onSignIn(form, mode);
  }
  return (
    <section className={`auth-panel${invitation ? " invitation-auth" : ""}`}>
      {!invitation && (
        <>
          <p className="office-kicker">
            {wedding ? i18n("ESTUDIO DE BODAS") : i18n("MI ESPACIO DE EVENTOS")}
          </p>
          <h1>
            {mode === "login"
              ? i18n("Bienvenido de nuevo.")
              : wedding
                ? i18n("Creemos algo inolvidable.")
                : i18n("Que empiece el plan.")}
          </h1>
          <p>
            {wedding
              ? i18n(
                  "Organiza cada boda con la pareja, sus invitados y todos los detalles en un mismo lugar.",
                )
              : i18n(
                  "Tu celebración, tus invitados y cada detalle en un solo lugar.",
                )}
          </p>
        </>
      )}
      {invitation && googleEnabled && (
        <a className="google-button" href={googleLink}>
          <GoogleIcon />
          <span>{i18n("Continuar con Google")}</span>
        </a>
      )}
      <form onSubmit={submit}>
        {mode === "register" && (
          <label>
            {i18n("Nombre")}{" "}
            <input
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
        )}
        <label>
          {i18n("Correo")}{" "}
          <input
            required
            type="email"
            autoComplete="username"
            readOnly={Boolean(initialEmail)}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          {i18n("Contraseña")}{" "}
          <input
            required
            type="password"
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            minLength={mode === "register" ? 10 : undefined}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <ActionButton className="office-button" disabled={busy}>
          {busy
            ? i18n("Entrando…")
            : invitation
              ? mode === "login"
                ? i18n("Entrar con correo")
                : i18n("Crear cuenta y aceptar")
              : mode === "login"
                ? i18n("Entrar")
                : wedding
                  ? i18n("Crear cuenta de planner")
                  : i18n("Crear mi cuenta")}{" "}
          {!invitation && "↗"}
        </ActionButton>
      </form>
      {!invitation && googleEnabled && (
        <a className="google-button" href={googleLink}>
          <GoogleIcon />
          <span>{i18n("Continuar con Google")}</span>
        </a>
      )}
      <button
        type="button"
        disabled={busy}
        className="plain-button"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          onClearError();
        }}
      >
        {mode === "login"
          ? invitation
            ? i18n("Crear cuenta con este correo")
            : i18n("¿Primera vez? Crea tu cuenta")
          : i18n("Ya tengo una cuenta")}
      </button>
      {!invitation && (
        <p className="portal-switch">
          {wedding
            ? i18n("¿Organizas otro tipo de evento?")
            : i18n("¿Planeas bodas?")}{" "}
          <a href={otherPortal}>
            {wedding ? i18n("Ir a The Date") : i18n("Ir al Estudio de bodas")} ↗
          </a>
        </p>
      )}
      {error && <Alert>{error}</Alert>}
    </section>
  );
}
