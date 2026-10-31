import { useEffect, useState } from "react";
import Icon from "@/components/icon";
import { api } from "@/lib/api/client";
import { invitationHost, validInvitationSlug } from "@/lib/events/domains";
import type { Event } from "@/lib/events/types";
import type { Deployment } from "./use-deployment";

export function readyInvitationURL(
  event: Event,
  deployment: Deployment | null,
) {
  if (
    event.isDemo ||
    event.paymentStatus !== "paid" ||
    !event.publishedAt ||
    !validInvitationSlug(event.slug)
  )
    return "";
  const host = invitationHost(event.kind, event.slug);
  return deployment?.eventId === event.id &&
    deployment.phase === "ready" &&
    deployment.host === host
    ? `https://${host}`
    : "";
}

export default function InvitationPublicLink({ event }: { event: Event }) {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  useEffect(() => {
    if (event.isDemo || !event.publishedAt || event.paymentStatus !== "paid")
      return;
    let active = true;
    async function check() {
      const result = await api<Deployment>(
        `/api/backend/events/${encodeURIComponent(event.id)}/deployment`,
      ).catch(() => null);
      if (active) setDeployment(result);
    }
    const visible = () => {
      if (document.visibilityState === "visible") void check();
    };
    void check();
    document.addEventListener("visibilitychange", visible);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", visible);
    };
  }, [event.id, event.publishedAt, event.paymentStatus, event.isDemo]);
  const url = readyInvitationURL(event, deployment);
  if (!url) return null;
  return (
    <footer className="invitation-public-access">
      <span>Lista para compartir</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir la invitación publicada de ${event.title}`}
      >
        <strong>Abrir invitación</strong>
        <Icon name="arrow" />
        <small>{invitationHost(event.kind, event.slug)}</small>
      </a>
    </footer>
  );
}
