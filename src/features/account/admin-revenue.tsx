import type { Overview } from "@/lib/account/types";
import { money } from "@/lib/account/types";
export default function AdminRevenue({ overview }: { overview: Overview }) {
  return (
    <>
      <div className="account-stats">
        <article>
          <small>CUENTAS</small>
          <strong>{overview.users}</strong>
        </article>
        <article>
          <small>INGRESOS REALES · USD</small>
          <strong>
            {money(
              overview.products.wedding.netCents +
                overview.products.general.netCents,
            )}
          </strong>
        </article>
        <article>
          <small>CORTESÍAS</small>
          <strong>
            {overview.products.wedding.courtesies +
              overview.products.general.courtesies}
          </strong>
        </article>
      </div>
      {overview.testMode && (
        <p className="account-note">
          Stripe está en modo de prueba. Los pagos de prueba y las cortesías no
          cuentan como ingresos ni generan saldo retirable.
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
              <h2>{kind === "wedding" ? "Bodas" : "Eventos"}</h2>
              <dl>
                <div>
                  <dt>Eventos</dt>
                  <dd>{r.events}</dd>
                </div>
                <div>
                  <dt>Ingresos brutos</dt>
                  <dd>{money(r.grossCents)}</dd>
                </div>
                <div>
                  <dt>Devoluciones y disputas</dt>
                  <dd>{money(r.refundedCents)}</dd>
                </div>
                <div>
                  <dt>Ingreso neto registrado</dt>
                  <dd>{money(r.netCents)}</dd>
                </div>
                <div>
                  <dt>Cortesías</dt>
                  <dd>{r.courtesies}</dd>
                </div>
                <div>
                  <dt>Pagos de prueba</dt>
                  <dd>{money(r.testCents)}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </>
  );
}
