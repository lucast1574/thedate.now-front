"use client";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/api/client";
import type { Run } from "@/lib/account/types";
export default function AffiliateWithdrawal({
  busy,
  available,
  run,
}: {
  busy: boolean;
  available: number;
  run: Run;
}) {
  const [amount, setAmount] = useState("50"),
    [method, setMethod] = useState(""),
    [details, setDetails] = useState("");
  function withdraw(e: FormEvent) {
    e.preventDefault();
    void run(
      () =>
        api("/api/backend/affiliates/withdrawals", "POST", {
          amountCents: Math.round(Number(amount) * 100),
          method,
          details,
        }),
      "Solicitud recibida. El saldo quedó reservado hasta su revisión.",
    );
  }
  return (
    <section className="account-card">
      <h2>Solicita tu retiro.</h2>
      <form onSubmit={withdraw}>
        <label>
          Monto en USD
          <input
            required
            type="number"
            min="50"
            max={Math.max(50, available / 100)}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          Medio de pago
          <input
            required
            minLength={2}
            maxLength={40}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="Transferencia bancaria"
          />
        </label>
        <label>
          Datos de pago
          <textarea
            required
            minLength={5}
            maxLength={500}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Titular, banco, país y cuenta"
          />
        </label>
        <button className="office-button" disabled={busy || available < 5000}>
          Solicitar retiro
        </button>
      </form>
    </section>
  );
}
