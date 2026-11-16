"use client";
import { useTranslator } from "@/lib/i18n/react";

import { ColorMemoryProvider } from "@/components/color-memory";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEventRecency } from "@/features/studio/use-event-recency";
import { api } from "@/lib/api/client";
import type { Event, User } from "@/lib/events/types";
import { useEventReadOnly } from "@/features/studio/use-event-read-only";
import { recordTab } from "@/features/manager/records/event-record-details";
import InvitationRecord from "./invitation-record";
import InvitationDesigner from "./invitation-designer";
export default function EditorPage({ id }: { id: string }) {
  const i18n = useTranslator();

  const params = useSearchParams();
  const paymentReturn = params.get("payment") === "success";
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const userId = user?.id || "",
    userRole = user?.role || "user";
  const [error, setError] = useState("");
  useEventRecency(userId, event?.kind, event?.id);
  const readOnly = useEventReadOnly(event);
  const reload = useCallback(async () => {
    const list = await api<Event[]>(
      "/api/backend/events",
      undefined,
      undefined,
      i18n,
    );
    const current = list.find((item) => item.id === id);
    if (!current) throw new Error(i18n("No tienes acceso a esta invitación."));
    setEvent(current);
  }, [id, i18n]);
  useEffect(() => {
    let active = true;
    Promise.all([
      api<Event[]>("/api/backend/events", undefined, undefined, i18n),
      api<User>("/api/session", undefined, undefined, i18n),
    ])
      .then(([list, user]) => {
        if (!active) return;
        setUser(user);
        const current = list.find((item) => item.id === id);
        if (!current) setError(i18n("No tienes acceso a esta invitación."));
        else setEvent(current);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [id, i18n]);
  useEffect(() => {
    if (!paymentReturn || !event || event.paymentStatus === "paid") return;
    let active = true;
    const timer = window.setInterval(() => {
      void api<Event[]>("/api/backend/events", undefined, undefined, i18n)
        .then((list) => {
          const latest = list.find((item) => item.id === id);
          if (active && latest?.paymentStatus === "paid") setEvent(latest);
        })
        .catch(() => {});
    }, 1500);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [paymentReturn, event, id, i18n]);
  if (error)
    return (
      <main className="editor-loading">
        <h1>{i18n("No se pudo abrir el editor")}</h1>
        <p role="alert">{error}</p>
        <Link href="/">{i18n("Volver al estudio e iniciar sesión")}</Link>
      </main>
    );
  if (!event)
    return (
      <main className="editor-loading" aria-busy="true">
        {i18n("Abriendo tu invitación…")}
      </main>
    );
  if (!event.isDemo && event.paymentStatus !== "paid")
    return (
      <main className="editor-loading">
        <h1>
          {paymentReturn
            ? i18n("Confirmando tu pago…")
            : i18n("Tu invitación está guardada")}
        </h1>
        <p role="status">
          {paymentReturn
            ? i18n(
                "El editor se abrirá cuando recibamos la confirmación del pago.",
              )
            : i18n(
                "Completa el pago para activar tu evento y continuar con tu diseño.",
              )}
        </p>
        <Link href={`/?event=${encodeURIComponent(event.id)}`}>
          {i18n("Volver a mi invitación")}
        </Link>
      </main>
    );
  if (readOnly && user)
    return (
      <InvitationRecord
        key={`${event.id}-${params.get("tab") || "invitation"}`}
        event={event}
        user={user}
        initialTab={recordTab(params.get("tab"))}
      />
    );
  return (
    <ColorMemoryProvider userId={userId}>
      {paymentReturn && (
        <p role="status" className="demo-continuity-note">
          {event.paymentStatus === "paid"
            ? i18n(
                "Pago confirmado. Tu diseño está listo para seguir editando.",
              )
            : i18n(
                "Confirmando tu pago. Tu diseño y tus fotos están guardados.",
              )}
        </p>
      )}
      <InvitationDesigner
        canPublish={event.ownerId === userId || userRole === "admin"}
        key={event.id}
        event={event}
        onSaved={reload}
      />
    </ColorMemoryProvider>
  );
}
