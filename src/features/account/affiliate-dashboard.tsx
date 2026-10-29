"use client";
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
  const [data, setData] = useState<Affiliate | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    api<Affiliate>("/api/backend/affiliates")
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function run(action: () => Promise<unknown>, message: string) {
    setBusy(true);
    setError("");
    try {
      await action();
      setData(await api<Affiliate>("/api/backend/affiliates"));
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
            {wedding ? "WEDDING PLANNERS" : "ORGANIZADORES"}
          </p>
          <h1>Tu saldo profesional</h1>
          <p>
            Todo lo que ganas con {wedding ? "tus bodas" : "tus eventos"}, en un
            solo lugar.
          </p>
        </div>
        <Link href="/?new=1" className="office-button">
          <Icon name="plus" />
          {wedding ? "Crear boda" : "Crear evento"}
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
            {busy ? "Cargando…" : "Reintentar"}
          </button>
        ) : (
          <p role="status">Cargando tu saldo…</p>
        )
      ) : (
        <>
          <div className="partner-balances">
            <article className="partner-available">
              <span>Disponible para ti</span>
              <strong>{money(data.availableCents)}</strong>
              <p>
                Puedes retirarlo o usarlo en{" "}
                {wedding ? "tu próxima boda" : "tu próximo evento"}.
              </p>
              {data.availableCents >= 1000 ? (
                <a href="#retiro" className="office-button">
                  Retirar saldo
                  <Icon name="arrow" />
                </a>
              ) : (
                <small>Los retiros se habilitan desde US$10.</small>
              )}
            </article>
            <article className="partner-pending">
              <span>En espera</span>
              <strong>{money(data.pendingCents || 0)}</strong>
              <p>
                {next
                  ? `Próximo saldo disponible el ${new Date(next.availableAt).toLocaleDateString("es", { day: "numeric", month: "long" })}.`
                  : "No tienes comisiones pendientes."}
              </p>
              <small>
                <Icon name="clock" />
                Cada comisión se libera 7 días después del pago.
              </small>
            </article>
          </div>
          <section
            className="partner-benefit"
            aria-label="Cómo ganas comisiones"
          >
            <div className="partner-benefit-amount">
              <Icon name="sparkle" />
              <strong>{wedding ? "US$5" : "US$2"}</strong>
              <span>para ti por cada {wedding ? "boda" : "evento"}</span>
            </div>
            <div>
              <h2>Tú creas, tú pagas, tú gestionas.</h2>
              <p>
                Paga {wedding ? "US$20 por boda" : "US$10 por evento"} desde tu
                cuenta y añade a {wedding ? "la pareja" : "tus clientes"} para
                colaborar. Tu comisión es privada.
              </p>
              <small>
                Solo pagos reales con Stripe. Sin comisión en pagos con saldo,
                pruebas o cortesías; las devoluciones ajustan el beneficio.
              </small>
            </div>
          </section>
          <div className="partner-section-heading">
            <h2>Tu actividad</h2>
            <span>
              {data.managedEvents || 0}{" "}
              {wedding
                ? data.managedEvents === 1
                  ? "boda gestionada"
                  : "bodas gestionadas"
                : data.managedEvents === 1
                  ? "evento gestionado"
                  : "eventos gestionados"}
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
