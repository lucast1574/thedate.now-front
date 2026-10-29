"use client";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/api/client";
import { money, type Run } from "@/lib/account/types";
export default function AffiliateWithdrawal({
  busy,
  available,
  run,
}: {
  busy: boolean;
  available: number;
  run: Run;
}) {
  const [amount, setAmount] = useState("10"),
    [details, setDetails] = useState("");
  function withdraw(e: FormEvent) {
    e.preventDefault();
    void run(
      () =>
        api("/api/backend/affiliates/withdrawals", "POST", {
          amountCents: Math.round(Number(amount) * 100),
          method: "bank",
          details,
        }),
      "Retiro solicitado. Reservamos el importe mientras revisamos tus datos.",
    );
  }
  if (available < 1000)
    return (
      <section className="partner-withdrawal-note">
        <strong>Retira desde US$10</strong>
        <p>
          Te faltan {money(1000 - available)} de saldo disponible. Cuando
          llegues, podrás añadir tu cuenta bancaria aquí.
        </p>
      </section>
    );
  return (
    <section className="account-card partner-withdrawal" id="retiro">
      <h2>Retirar saldo</h2>
      <p>
        Recíbelo por transferencia bancaria. Disponible: {money(available)}.
      </p>
      <form onSubmit={withdraw}>
        <label>
          Monto en USD
          <input
            required
            type="number"
            min="10"
            max={Math.max(10, available / 100)}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          Tu cuenta bancaria
          <textarea
            required
            minLength={5}
            maxLength={500}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Titular, banco, país y cuenta"
          />
        </label>
        <button className="office-button" disabled={busy || available < 1000}>
          {busy ? "Enviando solicitud…" : "Solicitar retiro"}
        </button>
      </form>
    </section>
  );
}
