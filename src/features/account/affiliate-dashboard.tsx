"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { money, type Affiliate } from "@/lib/account/types";
import type { User } from "@/lib/events/types";
import AffiliateWithdrawal from "./affiliate-withdrawal";
import AffiliateActivity from "./affiliate-activity";
import Alert from "@/components/alert";
import Icon from "@/components/icon";
export default function AffiliateDashboard({
  wedding,
}: {
  user: User;
  wedding: boolean;
}) {
  const i18n = useTranslator();

  const [data, setData] = useState<Affiliate | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    api<Affiliate>("/api/backend/affiliates", undefined, undefined, i18n)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [i18n]);
  async function run(action: () => Promise<unknown>, message: string) {
    setBusy(true);
    setError("");
    try {
      await action();
      setData(
        await api<Affiliate>(
          "/api/backend/affiliates",
          undefined,
          undefined,
          i18n,
        ),
      );
      setNotice(message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const pending = (data?.partnerEvents || [])
    .filter((e) => e.amount > e.credited)
    .sort((a, b) => Date.parse(a.availableAt) - Date.parse(b.availableAt));
  const next = pending[0];
  return (
    <section className="account-content partner-page">
      <header className="partner-heading">
        <div>
          <p className="office-kicker">
            {wedding ? "WEDDING PLANNERS" : i18n("ORGANIZADORES")}
          </p>
          <h1>{i18n("Tu saldo profesional")}</h1>
          <p>
            {i18n("Todo lo que ganas con")}{" "}
            {wedding ? i18n("tus bodas") : i18n("tus eventos")}
            {i18n(", en un solo lugar.")}
          </p>
        </div>
        <Link href="/?new=1" className="office-button">
          <Icon name="plus" />
          {wedding ? i18n("Crear boda") : i18n("Crear evento")}
        </Link>
      </header>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      {!data ? (
        error ? (
          <button
            className="office-button"
            disabled={busy}
            onClick={() => void run(async () => {}, "")}
          >
            {busy ? i18n("Cargando…") : i18n("Reintentar")}
          </button>
        ) : (
          <p role="status">{i18n("Cargando tu saldo…")}</p>
        )
      ) : (
        <>
          <div className="partner-balances">
            <article className="partner-available">
              <span>{i18n("Disponible para ti")}</span>
              <strong>{money(data.availableCents, i18n.locale)}</strong>
              <p>
                {i18n("Puedes retirarlo o usarlo en")}{" "}
                {wedding ? i18n("tu próxima boda") : i18n("tu próximo evento")}.
              </p>
              {data.availableCents >= 1000 ? (
                <a href="#retiro" className="office-button">
                  {i18n("Retirar saldo")} <Icon name="arrow" />
                </a>
              ) : (
                <small>{i18n("Los retiros se habilitan desde US$10.")}</small>
              )}
            </article>
            <article className="partner-pending">
              <span>{i18n("En espera")}</span>
              <strong>{money(data.pendingCents || 0, i18n.locale)}</strong>
              <p>
                {next
                  ? i18n("Próximo saldo disponible el {v0}.", {
                      v0: new Date(next.availableAt).toLocaleDateString(
                        i18n.locale,
                        {
                          day: "numeric",
                          month: "long",
                        },
                      ),
                    })
                  : i18n("No tienes comisiones pendientes.")}
              </p>
              <small>
                <Icon name="clock" />
                {i18n("Cada comisión se libera 7 días después del pago.")}
              </small>
            </article>
          </div>
          <section
            className="partner-benefit"
            aria-label={i18n("Cómo ganas comisiones")}
          >
            <div className="partner-benefit-amount">
              <Icon name="sparkle" />
              <strong>{wedding ? "US$5" : "US$2"}</strong>
              <span>
                {i18n("para ti por cada")}{" "}
                {wedding ? i18n("boda") : i18n("evento")}
              </span>
            </div>
            <div>
              <h2>{i18n("Tú creas, tú pagas, tú gestionas.")}</h2>
              <p>
                {i18n("Paga")}{" "}
                {wedding ? i18n("US$20 por boda") : i18n("US$10 por evento")}{" "}
                {i18n("desde tu cuenta y añade a")}{" "}
                {wedding ? i18n("la pareja") : i18n("tus clientes")}{" "}
                {i18n("para colaborar. Tu comisión es privada.")}
              </p>
              <small>
                {i18n(
                  "Solo pagos reales con Stripe. Sin comisión en pagos con saldo, pruebas o cortesías; las devoluciones ajustan el beneficio.",
                )}
              </small>
            </div>
          </section>
          <div className="partner-section-heading">
            <h2>{i18n("Tu actividad")}</h2>
            <span>
              {data.managedEvents || 0}{" "}
              {wedding
                ? data.managedEvents === 1
                  ? i18n("boda gestionada")
                  : i18n("bodas gestionadas")
                : data.managedEvents === 1
                  ? i18n("evento gestionado")
                  : i18n("eventos gestionados")}
            </span>
          </div>
          <AffiliateActivity data={data} wedding={wedding} />
          <AffiliateWithdrawal
            busy={busy}
            available={data.availableCents}
            run={run}
          />
        </>
      )}
    </section>
  );
}
