import { useTranslator } from "@/lib/i18n/react";
import type { Overview } from "@/lib/account/types";
import { money } from "@/lib/account/types";
export default function AdminRevenue({ overview }: { overview: Overview }) {
  const i18n = useTranslator();

  return (
    <>
      <div className="account-stats">
        <article>
          <small>{i18n("CUENTAS")}</small>
          <strong>{overview.users}</strong>
        </article>
        <article>
          <small>{i18n("INGRESOS REALES · USD")}</small>
          <strong>
            {money(
              overview.products.wedding.netCents +
                overview.products.general.netCents,
              i18n.locale,
            )}
          </strong>
        </article>
        <article>
          <small>{i18n("CORTESÍAS")}</small>
          <strong>
            {overview.products.wedding.courtesies +
              overview.products.general.courtesies}
          </strong>
        </article>
      </div>
      {overview.testMode && (
        <p className="account-note">
          {i18n(
            "Stripe está en modo de prueba. Los pagos de prueba y las cortesías no cuentan como ingresos ni generan saldo retirable.",
          )}
        </p>
      )}
      <div className="revenue-products">
        {(["wedding", "general"] as const).map((kind) => {
          const r = overview.products[kind];
          return (
            <article className="account-card" key={kind}>
              <p className="office-kicker">
                {kind === "wedding" ? "SAVE THE DATE" : "THE DATE"}
              </p>
              <h2>{kind === "wedding" ? i18n("Bodas") : i18n("Eventos")}</h2>
              <dl>
                <div>
                  <dt>{i18n("Eventos")}</dt>
                  <dd>{r.events}</dd>
                </div>
                <div>
                  <dt>{i18n("Ingresos brutos")}</dt>
                  <dd>{money(r.grossCents, i18n.locale)}</dd>
                </div>
                <div>
                  <dt>{i18n("Devoluciones y disputas")}</dt>
                  <dd>{money(r.refundedCents, i18n.locale)}</dd>
                </div>
                <div>
                  <dt>{i18n("Ingreso neto registrado")}</dt>
                  <dd>{money(r.netCents, i18n.locale)}</dd>
                </div>
                <div>
                  <dt>{i18n("Cortesías")}</dt>
                  <dd>{r.courtesies}</dd>
                </div>
                <div>
                  <dt>{i18n("Pagos de prueba")}</dt>
                  <dd>{money(r.testCents, i18n.locale)}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </>
  );
}
