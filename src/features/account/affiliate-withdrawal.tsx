"use client";
import { useTranslator } from "@/lib/i18n/react";

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
  const i18n = useTranslator();

  const [amount, setAmount] = useState("10"),
    [details, setDetails] = useState("");
  function withdraw(e: FormEvent) {
    e.preventDefault();
    void run(
      () =>
        api(
          "/api/backend/affiliates/withdrawals",
          "POST",
          {
            amountCents: Math.round(Number(amount) * 100),
            method: "bank",
            details,
          },
          i18n,
        ),
      i18n(
        "Retiro solicitado. Reservamos el importe mientras revisamos tus datos.",
      ),
    );
  }
  if (available < 1000)
    return (
      <section className="partner-withdrawal-note">
        <strong>{i18n("Retira desde US$10")}</strong>
        <p>
          {i18n("Te faltan")} {money(1000 - available, i18n.locale)}{" "}
          {i18n(
            "de saldo disponible. Cuando llegues, podrás añadir tu cuenta bancaria aquí.",
          )}
        </p>
      </section>
    );
  return (
    <section className="account-card partner-withdrawal" id="retiro">
      <h2>{i18n("Retirar saldo")}</h2>
      <p>
        {i18n("Recíbelo por transferencia bancaria. Disponible:")}{" "}
        {money(available, i18n.locale)}.
      </p>
      <form onSubmit={withdraw}>
        <label>
          {i18n("Monto en USD")}{" "}
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
          {i18n("Tu cuenta bancaria")}{" "}
          <textarea
            required
            minLength={5}
            maxLength={500}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={i18n("Titular, banco, país y cuenta")}
          />
        </label>
        <button className="office-button" disabled={busy || available < 1000}>
          {busy ? i18n("Enviando solicitud…") : i18n("Solicitar retiro")}
        </button>
      </form>
    </section>
  );
}
