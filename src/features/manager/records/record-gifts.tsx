import { useTranslator } from "@/lib/i18n/react";
import { useCallback } from "react";
import { api } from "@/lib/api/client";
import type { WishlistOwner } from "@/lib/events/wishlist";
import { useRecordSnapshot } from "./use-record-snapshot";

export default function RecordGifts({ eventId }: { eventId: string }) {
  const i18n = useTranslator();

  const load = useCallback(
    () =>
      api<WishlistOwner>(
        `/api/backend/events/${eventId}/wishlist`,
        undefined,
        undefined,
        i18n,
      ),
    [eventId, i18n],
  );
  const { data, error, retry } = useRecordSnapshot(load);
  if (error)
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={retry}>{i18n("Volver a intentar")}</button>
      </div>
    );
  if (!data) return <p role="status">{i18n("Cargando regalos…")}</p>;
  const { list, guests } = data;
  const chosen = list.items.filter((gift) => gift.guestId).length;
  return (
    <>
      <p className="record-summary">
        {list.items.length} {i18n("regalos ·")} {chosen}{" "}
        {chosen === 1 ? i18n("elegido") : i18n("elegidos")}
      </p>
      {!list.items.length ? (
        <p className="record-empty">{i18n("No hay regalos en esta lista.")}</p>
      ) : (
        <div className="record-table-scroll">
          <table className="record-table">
            <thead>
              <tr>
                <th>{i18n("Regalo")}</th>
                <th>{i18n("Lo regala")}</th>
                <th>{i18n("Estado")}</th>
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
                      (gift.guestId ? i18n("Invitado") : "—")}
                  </td>
                  <td data-label="Estado">
                    {gift.delivered
                      ? i18n("Recibido")
                      : gift.guestId
                        ? i18n("Reservado")
                        : i18n("Sin elección")}
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
