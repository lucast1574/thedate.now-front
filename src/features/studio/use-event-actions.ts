import { useTranslator } from "@/lib/i18n/react";
import { useState } from "react";
import { useDeployment, type Deployment } from "./use-deployment";
import { api } from "@/lib/api/client";
import type { Event, GuestFields } from "@/lib/events/types";

type Callbacks = {
  refreshGuests: (event: Event) => Promise<void>;
  reloadSelected: () => Promise<void>;
};
export function useEventActions(
  selected: Event | null,
  callbacks: Callbacks,
  canManage: boolean,
) {
  const i18n = useTranslator();

  const [publishing, setPublishing] = useState(false);
  const { deployment, setDeployment } = useDeployment(
    canManage ? selected?.id : undefined,
    callbacks.reloadSelected,
  );
  async function addGuest(fields: GuestFields) {
    if (!selected) return;
    await api(
      `/api/backend/events/${selected.id}/guests`,
      "POST",
      fields,
      i18n,
    );
    await callbacks.refreshGuests(selected);
  }
  async function checkout() {
    if (!selected) return;
    const result = await api<{ url: string }>(
      `/api/backend/events/${selected.id}/checkout`,
      "POST",
      undefined,
      i18n,
    );
    window.location.href = result.url;
  }
  async function publish() {
    if (!selected) return;
    setPublishing(true);
    try {
      const result = await api<Deployment>(
        `/api/backend/events/${selected.id}/publish`,
        "POST",
        undefined,
        i18n,
      );
      setDeployment(result);
      if (result.phase === "ready") await callbacks.reloadSelected();
    } finally {
      setPublishing(false);
    }
  }
  async function sendInvitations() {
    if (!selected) return "";
    const result = await api<{
      sent: number;
      failed: number;
      remaining: number;
      uncertain: number;
    }>(
      `/api/backend/events/${selected.id}/send-invitations`,
      "POST",
      undefined,
      i18n,
    );
    await callbacks.refreshGuests(selected);
    return `${result.sent} invitaciones enviadas${result.failed ? `, ${result.failed} fallidas` : ""}${result.remaining ? i18n(", {v0} pendientes de enviar", { v0: result.remaining }) : ""}${result.uncertain ? i18n(", {v0} requieren revisar la entrega", { v0: result.uncertain }) : ""}.`;
  }
  return {
    deployment,
    publishing,
    addGuest,
    checkout,
    publish,
    sendInvitations,
  };
}
