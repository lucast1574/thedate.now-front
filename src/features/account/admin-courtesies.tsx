"use client";
import Listbox from "@/components/listbox";
import { useState, type FormEvent } from "react";
import type { Event } from "@/lib/events/types";
import type { Run } from "@/lib/account/types";
import { api } from "@/lib/api/client";
export default function AdminCourtesies({
  events,
  busy,
  run,
}: {
  events: Event[];
  busy: boolean;
  run: Run;
}) {
  const [id, setId] = useState(""),
    [reason, setReason] = useState("");
  const eligible = events.filter(
    (e) => !e.isDemo && e.paymentStatus !== "paid",
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    await run(
      () => api(`/api/backend/admin/events/${id}/courtesy`, "POST", { reason }),
      "Cortesía otorgada. El evento tiene todas las herramientas y no genera ingresos ni comisiones.",
    );
  }
  return (
    <section className="account-card">
      <p className="office-kicker">CORTESÍAS</p>
      <h2>Regala un día especial.</h2>
      <p>
        Tus eventos de administrador se habilitan gratis al crearlos. Aquí
        puedes habilitar el evento de otra persona, con un motivo registrado. Si
        inició un checkout, primero debe resolverlo.
      </p>
      <form onSubmit={submit}>
        <label>
          Evento
          <Listbox required value={id} onValueChange={(value) => setId(value)}>
            <option value="">Elige un evento pendiente</option>
            {eligible.map((e) => (
              <option key={e.id} value={e.id}>
                {e.kind === "wedding" ? "Boda" : "Evento"} · {e.title}
              </option>
            ))}
          </Listbox>
        </label>
        <label>
          Motivo
          <input
            required
            minLength={3}
            maxLength={300}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Cortesía para un familiar"
          />
        </label>
        <button disabled={busy || !id} className="office-button">
          Habilitar sin cobro
        </button>
      </form>
    </section>
  );
}
