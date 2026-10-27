"use client";
import { ColorMemoryProvider } from "@/components/color-memory";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api/client";
import type { Event, User } from "@/lib/events/types";
import InvitationDesigner from "./invitation-designer";
export default function EditorPage({ id }: { id: string }) {
  const paymentReturn = useSearchParams().get("payment") === "success";
  const [event, setEvent] = useState<Event | null>(null);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState<User["role"]>("user");
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    const list = await api<Event[]>("/api/backend/events");
    const current = list.find((item) => item.id === id);
    if (!current) throw new Error("No tienes acceso a esta invitación.");
    setEvent(current);
  }, [id]);
  useEffect(() => {
    let active = true;
    Promise.all([
      api<Event[]>("/api/backend/events"),
      api<User>("/api/session"),
    ])
      .then(([list, user]) => {
        if (!active) return;
        setUserId(user.id);
        setUserRole(user.role);
        const current = list.find((item) => item.id === id);
        if (!current) setError("No tienes acceso a esta invitación.");
        else setEvent(current);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  useEffect(() => {
    if (!paymentReturn || !event || event.paymentStatus === "paid") return;
    let active = true;
    const timer = window.setInterval(() => {
      void api<Event[]>("/api/backend/events")
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
  }, [paymentReturn, event, id]);
  if (error)
    return (
      <main className="editor-loading">
        <h1>No se pudo abrir el editor</h1>
        <p role="alert">{error}</p>
        <Link href="/">Volver al estudio e iniciar sesión</Link>
      </main>
    );
  if (!event)
    return (
      <main className="editor-loading" aria-busy="true">
        Abriendo tu invitación…
      </main>
    );
  if (!event.isDemo && event.paymentStatus !== "paid")
    return (
      <main className="editor-loading">
        <h1>
          {paymentReturn
            ? "Confirmando tu pago…"
            : "Tu invitación está guardada"}
        </h1>
        <p role="status">
          {paymentReturn
            ? "El editor se abrirá cuando recibamos la confirmación del pago."
            : "Completa el pago para activar tu evento y continuar con tu diseño."}
        </p>
        <Link href={`/?event=${encodeURIComponent(event.id)}`}>
          Volver a mi invitación
        </Link>
      </main>
    );
  return (
    <ColorMemoryProvider userId={userId}>
      {paymentReturn && (
        <p role="status" className="demo-continuity-note">
          {event.paymentStatus === "paid"
            ? "Pago confirmado. Tu diseño está listo para seguir editando."
            : "Confirmando tu pago. Tu diseño y tus fotos están guardados."}
        </p>
      )}
      <InvitationDesigner
        finishHref={
          event.ownerId === userId || userRole === "admin"
            ? `/manager/${encodeURIComponent(event.id)}`
            : `/manager/${encodeURIComponent(event.id)}`
        }
        key={event.id}
        event={event}
        onSaved={reload}
      />
    </ColorMemoryProvider>
  );
}
