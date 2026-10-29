"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { money, statusLabel, type Affiliate } from "@/lib/account/types";
import type { User } from "@/lib/events/types";
import AffiliateWithdrawal from "./affiliate-withdrawal";
import Alert from "@/components/alert";
export default function AffiliateDashboard({
  user,
  wedding,
}: {
  user: User;
  wedding: boolean;
}) {
  const [data, setData] = useState<Affiliate | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  async function load() {
    setData(await api<Affiliate>("/api/backend/affiliates"));
  }
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
      await load();
      setNotice(message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const professional = wedding
    ? user.role === "planner"
    : user.role === "organizer";
  return (
    <section className="account-content">
      <p className="office-kicker">
        PROGRAMA PARA {wedding ? "WEDDING PLANNERS" : "ORGANIZADORES"}
      </p>
      <h1>
        {wedding
          ? "Cada boda cuenta. Tu trabajo también."
          : "Organiza más. Gana con cada evento."}
      </h1>
      <p className="office-lead">
        {professional
          ? wedding
            ? "Paga US$20 por cada boda desde tu cuenta profesional y recibe US$5 de comisión. Gestiona todas tus bodas y añade a cada pareja a su evento."
            : "Paga US$10 por cada evento desde tu cuenta profesional y recibe US$2 de comisión. Gestiona todos tus eventos y añade a tus clientes a cada uno."
          : "Las comisiones se reservan a las cuentas profesionales. Las compras desde tu cuenta personal no generan comisiones."}{" "}
        {professional &&
          " Tu comisión es privada y queda disponible después de 7 días. Retira desde US$10 o usa tu saldo para pagar próximos eventos completos."}
      </p>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      {user.role === "admin" ? (
        <p className="account-note">
          Las cuentas administradoras y las cortesías no participan en
          comisiones. Puedes gestionar los retiros desde Administración.
        </p>
      ) : (
        data && (
          <>
            <div className="account-stats">
              <article>
                <small>SALDO DISPONIBLE</small>
                <strong>{money(data.availableCents)}</strong>
              </article>
              <article>
                <small>SALDO PENDIENTE · 7 DÍAS</small>
                <strong>{money(data.pendingCents || 0)}</strong>
              </article>
              <article>
                <small>EVENTOS GESTIONADOS / CON COMISIÓN</small>
                <strong>
                  {data.managedEvents || 0} / {data.partnerEvents?.length || 0}
                </strong>
              </article>
            </div>
            <section className="account-card">
              <h2>Gestiona todo desde tu cuenta.</h2>
              <p>
                Crea y paga cada evento desde tu cuenta profesional. Después,
                añade a tus clientes para colaborar en su invitación. Ellos no
                ven tus comisiones.
              </p>
              <p>
                El beneficio corresponde solo a eventos creados y pagados desde
                tu cuenta profesional. Las compras de cuentas normales no
                generan comisión. Las pruebas, cortesías, pagos con saldo y
                devoluciones no generan saldo disponible.
              </p>
            </section>
            {!!data.partnerEvents?.length && (
              <section className="account-card">
                <h2>Tus eventos con beneficio</h2>
                {data.partnerEvents.map((entry) => (
                  <div className="access-row" key={entry.eventId}>
                    <span>
                      {entry.title}
                      <small>
                        {entry.kind === "wedding" ? "Boda" : "Evento"} ·{" "}
                        {entry.credited >= entry.amount
                          ? "Disponible"
                          : "Pendiente hasta " +
                            new Date(entry.availableAt).toLocaleDateString(
                              "es",
                            )}
                      </small>
                    </span>
                    <strong>{money(entry.amount)}</strong>
                  </div>
                ))}
              </section>
            )}
            <AffiliateWithdrawal
              busy={busy}
              available={data.availableCents}
              run={run}
            />
            <section className="account-card">
              <h2>Tus solicitudes.</h2>
              {data.withdrawals.length === 0 ? (
                <p>Aún no solicitaste un retiro.</p>
              ) : (
                data.withdrawals.map((w) => (
                  <div className="access-row" key={w.id}>
                    <span>
                      {money(w.amountCents)}
                      <small>
                        {new Date(w.createdAt).toLocaleDateString("es-PE")} ·{" "}
                        {w.method}
                      </small>
                      {w.note && <small>{w.note}</small>}
                    </span>
                    <strong>{statusLabel[w.status]}</strong>
                  </div>
                ))
              )}
            </section>
          </>
        )
      )}
    </section>
  );
}
