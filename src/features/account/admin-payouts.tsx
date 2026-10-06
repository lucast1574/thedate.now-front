"use client";
import { useState } from "react";
import { money, statusLabel, type Payout, type Run } from "@/lib/account/types";
import { api } from "@/lib/api/client";
export default function AdminPayouts({
  rows,
  busy,
  run,
}: {
  rows: Payout[];
  busy: boolean;
  run: Run;
}) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  function update(row: Payout, status: string) {
    return run(
      () =>
        api(
          `/api/backend/admin/users/${row.userId}/withdrawals/${row.withdrawal.id}`,
          "PATCH",
          { status, note: notes[row.withdrawal.id] ?? "" },
        ),
      "Retiro actualizado y auditado.",
    );
  }
  return (
    <section className="account-card">
      <p className="office-kicker">AFILIADOS · RETIROS</p>
      <h2>Pagos con registro.</h2>
      <p>
        10% del primer pago real de cada referido; mínimo US$50. Marca pagado
        después de transferir y escribe la referencia; este panel no envía
        dinero automáticamente.
      </p>
      {rows.length === 0 && <p>No hay solicitudes de retiro.</p>}
      {rows.map((row) => {
        const entry = row.withdrawal;
        return (
          <article className="payout-row" key={entry.id}>
            <h3>
              {row.name} · {money(entry.amountCents)}
            </h3>
            <p>
              {row.email} · {statusLabel[entry.status]}
            </p>
            <p>
              {entry.method}: {entry.details}
            </p>
            {row.balanceCents < 0 && (
              <p className="alert error">
                Saldo negativo por reversos: {money(row.balanceCents)}. Revisa
                antes de transferir.
              </p>
            )}
            {entry.note && <p>Registro: {entry.note}</p>}
            {["pending", "approved"].includes(entry.status) && (
              <>
                <label>
                  Motivo o referencia de transferencia
                  <input
                    minLength={3}
                    maxLength={500}
                    value={notes[entry.id] ?? ""}
                    onChange={(e) =>
                      setNotes({ ...notes, [entry.id]: e.target.value })
                    }
                  />
                </label>
                <div className="account-actions">
                  <button
                    disabled={busy || (notes[entry.id]?.length ?? 0) < 3}
                    className="office-button"
                    onClick={() =>
                      void update(
                        row,
                        entry.status === "pending" ? "approved" : "paid",
                      )
                    }
                  >
                    {entry.status === "pending"
                      ? "Aprobar"
                      : "Registrar pago realizado"}
                  </button>
                  <button
                    disabled={busy || (notes[entry.id]?.length ?? 0) < 3}
                    onClick={() => void update(row, "rejected")}
                  >
                    Rechazar y liberar saldo
                  </button>
                </div>
              </>
            )}
          </article>
        );
      })}
    </section>
  );
}
