import { useCallback } from "react";
import { api } from "@/lib/api/client";
import type { WishlistOwner } from "@/lib/events/wishlist";
import { useRecordSnapshot } from "./use-record-snapshot";

export default function RecordGifts({ eventId }: { eventId: string }) {
  const load = useCallback(
    () => api<WishlistOwner>(`/api/backend/events/${eventId}/wishlist`),
    [eventId],
  );
  const { data, error, retry } = useRecordSnapshot(load);
  if (error)
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={retry}>Volver a intentar</button>
      </div>
    );
  if (!data) return <p role="status">Cargando regalos…</p>;
  const { list, guests } = data;
  const chosen = list.items.filter((gift) => gift.guestId).length;
  return (
    <>
      <p className="record-summary">
        {list.items.length} regalos · {chosen}{" "}
        {chosen === 1 ? "elegido" : "elegidos"}
      </p>
      {!list.items.length ? (
        <p className="record-empty">No hay regalos en esta lista.</p>
      ) : (
        <div className="record-table-scroll">
          <table className="record-table">
            <thead>
              <tr>
                <th>Regalo</th>
                <th>Lo regala</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((gift) => (
                <tr key={gift.id}>
                  <td>
                    <strong>{gift.title}</strong>
                  </td>
                  <td data-label="Lo regala">
                    {guests[gift.guestId || ""] ||
                      (gift.guestId ? "Invitado" : "—")}
                  </td>
                  <td data-label="Estado">
                    {gift.delivered
                      ? "Recibido"
                      : gift.guestId
                        ? "Reservado"
                        : "Sin elección"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
