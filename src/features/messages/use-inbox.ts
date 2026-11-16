import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslator } from "@/lib/i18n/react";
import { api } from "@/lib/api/client";
import type { Conversation, InboxMessage, MessagePage } from "./types";

export function useInbox(eventId: string, initialGuest?: string) {
  const i18n = useTranslator();
  const base = `/api/backend/events/${eventId}/conversations`;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [guestId, setGuestId] = useState(initialGuest || "");
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const running = useRef(false),
    selected = useRef(initialGuest || "");
  const request = useRef<{ id: string; text: string; guest: string } | null>(
    null,
  );
  const refresh = useCallback(async () => {
    const list = await api<Conversation[]>(base, undefined, undefined, i18n);
    setConversations(list);
  }, [base, i18n]);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const list = await api<Conversation[]>(
          base,
          undefined,
          undefined,
          i18n,
        );
        if (active) {
          setConversations(list);
          setLoading(false);
        }
      } catch (e) {
        if (active) {
          setError((e as Error).message);
          setLoading(false);
        }
      }
    };
    void load();
    const timer = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 12000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [base, i18n]);
  useEffect(() => {
    if (!guestId) return;
    let active = true;
    const load = async () => {
      try {
        const page = await api<MessagePage>(
          `${base}/${guestId}`,
          undefined,
          undefined,
          i18n,
        );
        if (!active) return;
        setMessages((current) => {
          const merged = new Map(
            current.filter((m) => m.guestId === guestId).map((m) => [m.id, m]),
          );
          page.messages.forEach((m) => merged.set(m.id, m));
          return [...merged.values()].sort((a, b) =>
            a.createdAt.localeCompare(b.createdAt),
          );
        });
        setHasMore(page.hasMore);
        const latest = page.messages.find((m) => m.direction === "in");
        if (latest) {
          await api(
            `${base}/${guestId}`,
            "PATCH",
            { through: latest.id },
            i18n,
          );
          if (active) await refresh();
        }
      } catch (e) {
        if (active) setError((e as Error).message);
      }
    };
    void load();
    const timer = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 12000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [base, guestId, i18n, refresh]);
  async function run(action: () => Promise<void>) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      running.current = false;
      setBusy(false);
    }
  }
  const attend = (attended: boolean) =>
    run(async () => {
      const through = [...messages]
        .reverse()
        .find((m) => m.direction === "in")?.id;
      if (!through) return;
      await api(`${base}/${guestId}`, "PATCH", { through, attended }, i18n);
      await refresh();
    });
  const send = (text: string) =>
    run(async () => {
      if (
        !request.current ||
        request.current.text !== text ||
        request.current.guest !== guestId
      )
        request.current = { id: crypto.randomUUID(), text, guest: guestId };
      const result = await api<InboxMessage>(
        `${base}/${guestId}`,
        "POST",
        {
          requestId: request.current.id,
          text,
          replyTo: [...messages].reverse().find((m) => m.direction === "in")
            ?.id,
        },
        i18n,
      );
      if (selected.current === guestId)
        setMessages((current) => [
          ...current.filter((m) => m.id !== result.id),
          result,
        ]);
      if (result.delivery !== "sent")
        throw new Error(
          i18n(
            "El envío necesita verificación en WhatsApp. No lo repitas para evitar duplicados.",
          ),
        );
      request.current = null;
    });
  const older = () =>
    run(async () => {
      const before = messages[0]?.id;
      if (!before) return;
      const page = await api<MessagePage>(
        `${base}/${guestId}?before=${before}`,
        undefined,
        undefined,
        i18n,
      );
      setMessages((current) => [...page.messages].reverse().concat(current));
      setHasMore(page.hasMore);
    });
  return {
    conversations,
    guestId,
    select: (id: string) => {
      selected.current = id;
      setGuestId(id);
      setMessages([]);
    },
    messages,
    hasMore,
    older,
    attend,
    send,
    busy,
    loading,
    error,
  };
}
