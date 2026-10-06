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
      <p className="office-kicker">PROGRAMA DE AFILIADOS</p>
      <h1>
        {wedding
          ? "Comparte momentos. Gana juntos."
          : "Tu recomendación tiene valor."}
      </h1>
      <p className="office-lead">
        Recibe 10% del primer pago real de cada persona nueva que se registre
        con tu enlace. Un solo referido para ambas marcas. Retira desde US$50.
      </p>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      {user.role === "admin" ? (
        <p className="account-note">
          Las cuentas administradoras y las cortesías no participan en
          comisiones. Puedes gestionar los retiros desde Administración.
        </p>
      ) : data && !data.enabled ? (
        <button
          className="office-button"
          disabled={busy}
          onClick={() =>
            void run(
              () => api("/api/backend/affiliates/join", "POST"),
              "Ya puedes compartir tus enlaces.",
            )
          }
        >
          Activar mis enlaces de afiliado
        </button>
      ) : (
        data && (
          <>
            <div className="account-stats">
              <article>
                <small>SALDO DISPONIBLE</small>
                <strong>{money(data.availableCents)}</strong>
              </article>
              <article>
                <small>COMISIONES NETAS</small>
                <strong>{money(data.earnedCents)}</strong>
              </article>
              <article>
                <small>REGISTROS / PRIMEROS PAGOS</small>
                <strong>
                  {data.referrals} / {data.conversions}
                </strong>
              </article>
            </div>
            <section className="account-card">
              <h2>Una invitación a descubrir.</h2>
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
                La atribución se guarda al crear la cuenta, hasta 30 días
                después de abrir el enlace. Los pagos de prueba, cortesías y
                devoluciones no generan saldo retirable.
              </p>
            </section>
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
