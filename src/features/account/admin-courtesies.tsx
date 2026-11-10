"use client";
import Listbox from "@/components/listbox";
import Alert from "@/components/alert";
import { useState, type FormEvent } from "react";
import type { Event, User } from "@/lib/events/types";
import type { Run } from "@/lib/account/types";
import { api } from "@/lib/api/client";
export default function AdminCourtesies({
  busy,
  run,
}: {
  busy: boolean;
  run: Run;
}) {
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [id, setId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const eligible = events.filter((event) => event.paymentStatus !== "paid");
  const selected = eligible.find((event) => event.id === id);
  async function search(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAccount(null);
    setEvents([]);
    setId("");
    setError("");
    try {
      const [user] = await api<User[]>(
        `/api/backend/admin/users?${new URLSearchParams({ email: email.trim().toLowerCase() })}`,
      );
      if (!user)
        throw new Error(
          "No hay una cuenta registrada con ese correo en este producto.",
        );
      const list = await api<Event[]>(
        `/api/backend/admin/users/${user.id}/events`,
      );
      setAccount(user);
      setEvents(list);
      setId(list.find((event) => event.paymentStatus !== "paid")?.id || "");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!selected || !account) return;
    const target = selected;
    await run(
      async () => {
        await api(`/api/backend/admin/events/${target.id}/courtesy`, "POST", {
          reason,
        });
        setEvents((list) =>
          list.map((event) =>
            event.id === target.id
              ? { ...event, paymentStatus: "paid", paymentSource: "courtesy" }
              : event,
          ),
        );
        setId("");
        setReason("");
      },
      target.isDemo
        ? "Cortesía otorgada: esta cuenta puede crear una invitación gratis. Se consume una sola vez."
        : "Cortesía otorgada. Esta invitación está habilitada sin cobro.",
    );
  }
  return (
    <section className="account-card">
      <p className="office-kicker">CORTESÍAS</p>
      <h2>Una invitación de regalo.</h2>
      <p>
        Busca la cuenta por su correo. Puedes regalar su próxima invitación o
        habilitar una que tenga pendiente de pago. Cada cortesía cubre una sola
        invitación.
      </p>
      <form onSubmit={search}>
        <label>
          Correo de la cuenta
          <input
            required
            type="email"
            value={email}
            disabled={busy || loading}
            onChange={(e) => {
              setEmail(e.target.value);
              setAccount(null);
              setEvents([]);
              setId("");
            }}
            placeholder="nombre@correo.com"
          />
        </label>
        <button
          disabled={busy || loading}
          className="office-button"
          type="submit"
        >
          {loading ? "Buscando…" : "Buscar cuenta"}
        </button>
      </form>
      <Alert>{error}</Alert>
      {account && (
        <>
          <p>
            <strong>{account.name}</strong>
            <br />
            {account.email}
          </p>
          {events.some(
            (event) => event.isDemo && event.paymentStatus === "paid",
          ) && (
            <p role="status">
              Esta cuenta tiene una invitación gratis disponible. Se consumirá
              al crearla.
            </p>
          )}
          {eligible.length ? (
            <form onSubmit={submit}>
              <label>
                Invitación
                <Listbox
                  required
                  value={id}
                  disabled={busy}
                  onValueChange={setId}
                >
                  <option value="">Elige una invitación</option>
                  {eligible.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.isDemo
                        ? "Próxima invitación · una sola vez"
                        : event.title}
                    </option>
                  ))}
                </Listbox>
              </label>
              <p>
                {selected?.isDemo
                  ? "La cuenta podrá crear una invitación sin pagar. Las siguientes conservarán su precio habitual."
                  : "Se habilitará únicamente la invitación elegida. Si inició un checkout, primero debe resolverlo."}
              </p>
              <label>
                Motivo
                <input
                  required
                  minLength={3}
                  maxLength={300}
                  value={reason}
                  disabled={busy}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Cortesía para tester"
                />
              </label>
              <button disabled={busy || !selected} className="office-button">
                Otorgar cortesía
              </button>
            </form>
          ) : (
            <p>No hay invitaciones pendientes para otorgar otra cortesía.</p>
          )}
        </>
      )}
    </section>
  );
}
