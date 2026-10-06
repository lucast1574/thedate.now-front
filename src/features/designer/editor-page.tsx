"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import type { Event } from "@/lib/events/types";
import InvitationDesigner from "./invitation-designer";
export default function EditorPage({ id }: { id: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    const list = await api<Event[]>("/api/backend/events");
    const current = list.find((item) => item.id === id);
    if (!current) throw new Error("No tienes acceso a esta invitación.");
    setEvent(current);
  }, [id]);
  useEffect(() => {
    let active = true;
    api<Event[]>("/api/backend/events")
      .then((list) => {
        if (!active) return;
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
  return <InvitationDesigner key={event.id} event={event} onSaved={reload} />;
}
