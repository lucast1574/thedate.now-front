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
  const links = data?.enabled
    ? [
        `https://studio.save.thedate.now/?ref=${data.code}`,
        `https://crea.thedate.now/?ref=${data.code}`,
      ]
    : [];
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
        Como profesional, paga US$15 por boda o US$8 por evento. Si paga tu
        cliente el precio público (US$20 / US$10), recibes US$5 / US$2 por cada
        evento elegible. Un solo beneficio por evento. Retira desde US$10 o usa
        tu saldo para pagar próximos eventos completos.
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
              <h2>Tu enlace ya está activo.</h2>
              <p>
                Comparte el enlace con tus clientes. También puedes crear sus
                eventos desde tu cuenta profesional y generar el enlace de pago
                al activarlos.
              </p>
              {links.map((link, i) => (
                <label key={link}>
                  {i === 0 ? "Save the Date · bodas" : "The Date · eventos"}
                  <div className="copy-link">
                    <input readOnly value={link} />
                    <button
                      onClick={() =>
                        void navigator.clipboard
                          .writeText(link)
                          .then(() => setNotice("Enlace copiado."))
                          .catch(() =>
                            setError("Selecciona y copia el enlace."),
                          )
                      }
                    >
                      Copiar enlace
                    </button>
                  </div>
                </label>
              ))}
              <p>
                La atribución se guarda al crear la cuenta hasta 30 días después
                de abrir el enlace. Los profesionales reciben comisión en cada
                evento elegible; los referidos generales conservan el 10% del
                primer pago. Las pruebas, cortesías y devoluciones no generan
                saldo. Activa tu perfil profesional desde el estudio si aún no
                lo tienes.
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
