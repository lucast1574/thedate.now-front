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
  const { deployment, setDeployment } = useDeployment(
    canManage ? selected?.id : undefined,
    callbacks.reloadSelected,
  );
  async function addGuest(fields: GuestFields) {
    if (!selected) return;
    await api(`/api/backend/events/${selected.id}/guests`, "POST", fields);
    await callbacks.refreshGuests(selected);
  }
  async function checkout() {
    if (!selected) return;
    const result = await api<{ url: string }>(
      `/api/backend/events/${selected.id}/checkout`,
      "POST",
    );
    window.location.href = result.url;
  }
  async function publish() {
    if (!selected) return;
    const result = await api<Deployment>(
      `/api/backend/events/${selected.id}/publish`,
      "POST",
    );
    setDeployment(result);
    if (result.phase !== "ready") return;
    await callbacks.reloadSelected();
  }
  async function sendInvitations() {
    if (!selected) return "";
    const result = await api<{
      sent: number;
      failed: number;
      remaining: number;
      uncertain: number;
    }>(`/api/backend/events/${selected.id}/send-invitations`, "POST");
    await callbacks.refreshGuests(selected);
    return `${result.sent} invitaciones enviadas${result.failed ? `, ${result.failed} fallidas` : ""}${result.remaining ? `, ${result.remaining} pendientes de enviar` : ""}${result.uncertain ? `, ${result.uncertain} requieren revisar la entrega` : ""}.`;
  }
  return {
    deployment,
    addGuest,
    checkout,
    publish,
    sendInvitations,
  };
}
