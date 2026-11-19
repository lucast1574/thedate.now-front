import { useState } from "react";
import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import Listbox from "@/components/listbox";
import { fullName, responseLabel } from "@/lib/events/attendees";
import type { Guest } from "@/lib/events/types";
import type { Conversation } from "./types";
export default function ConversationList({
  guests,
  conversations,
  loading,
  selectedId,
  onSelect,
  now,
}: {
  guests: Guest[];
  conversations: Conversation[];
  loading: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
  now: number;
}) {
  const i18n = useTranslator();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const filtered = conversations.filter((c) => {
    const guest = guests.find((g) => g.id === c.guestId);
    return (
      guest &&
      `${fullName(guest)} ${guest.phone}`
        .toLocaleLowerCase(i18n.locale)
        .includes(query.trim().toLocaleLowerCase(i18n.locale)) &&
      (filter === "all" ||
        (c.last.direction === "in" &&
          (filter === "pending" ? c.pending : !c.pending)))
    );
  });
  return (
    <aside className="inbox-list" aria-label={i18n("Conversaciones")}>
      <div className="message-center-tools">
        <label className="message-center-search">
          <Icon name="lucide:search" />
          <input
            aria-label={i18n("Buscar conversación")}
            placeholder={i18n("Buscar invitado o teléfono")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <Listbox
          aria-label={i18n("Estado de las conversaciones")}
          value={filter}
          onValueChange={setFilter}
        >
          <option value="all">{i18n("Todas las conversaciones")}</option>
          <option value="pending">{i18n("Pendientes de atender")}</option>
          <option value="attended">{i18n("Atendidas")}</option>
        </Listbox>
      </div>
      {!loading && conversations.length > 0 && !filtered.length && (
        <p className="inbox-filter-empty">
          {i18n("No hay conversaciones con estos filtros.")}
        </p>
      )}

      {loading && <p role="status">{i18n("Cargando mensajes…")}</p>}
      {!loading && !conversations.length && (
        <div className="inbox-empty">
          <Icon name="lucide:messages-square" />
          <h2>{i18n("Aquí verás lo que escriben")}</h2>
          <p>
            {i18n(
              "Cuando un invitado envíe un mensaje o una foto al WhatsApp de la invitación, aparecerá aquí.",
            )}
          </p>
        </div>
      )}
      {filtered.map((conversation) => {
        const guest = guests.find((g) => g.id === conversation.guestId);
        if (!guest) return null;
        return (
          <button
            key={guest.id}
            type="button"
            className={guest.id === selectedId ? "is-selected" : ""}
            aria-pressed={guest.id === selectedId}
            onClick={() => onSelect(guest.id)}
          >
            <span>
              <strong>{fullName(guest)}</strong>
              {conversation.unread && (
                <small className="inbox-new">{i18n("Nuevo")}</small>
              )}
            </span>
            <small>{responseLabel(guest, now, i18n)}</small>
            <p>{conversation.last.text || i18n("Adjunto recibido")}</p>
            <span>
              <small>
                {new Date(conversation.last.createdAt).toLocaleDateString(
                  i18n.locale,
                )}
              </small>
              {conversation.last.direction === "in" && (
                <small
                  className={`conversation-status ${conversation.pending ? "is-pending" : "is-attended"}`}
                >
                  {conversation.pending ? i18n("Pendiente") : i18n("Atendido")}
                </small>
              )}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
