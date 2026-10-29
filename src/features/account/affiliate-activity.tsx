import Link from "next/link";
import { money, statusLabel, type Affiliate } from "@/lib/account/types";
import Icon from "@/components/icon";
export default function AffiliateActivity({
  data,
  wedding,
}: {
  data: Affiliate;
  wedding: boolean;
}) {
  const entries = [...(data.partnerEvents || [])].sort(
    (a, b) => Date.parse(b.availableAt) - Date.parse(a.availableAt),
  );
  return (
    <div className="partner-activity">
      <section className="partner-history">
        <h3>Comisiones</h3>
        {entries.length ? (
          entries.map((e) => (
            <div className="partner-history-row" key={e.eventId}>
              <span>
                <Link href={`/?event=${encodeURIComponent(e.eventId)}`}>
                  {e.title}
                </Link>
                <small>
                  {e.amount === 0
                    ? "Revertida"
                    : e.credited >= e.amount
                      ? "Disponible"
                      : `Disponible el ${new Date(e.availableAt).toLocaleDateString("es", { day: "numeric", month: "short" })}`}
                </small>
              </span>
              <strong>{money(e.amount)}</strong>
            </div>
          ))
        ) : (
          <div className="partner-empty">
            <Icon name="sparkle" />
            <p>
              Tu primera comisión empieza con tu próxima{" "}
              {wedding ? "boda" : "celebración"}.
            </p>
            <small>Aparecerá aquí cuando completes el pago.</small>
          </div>
        )}
      </section>
      <section className="partner-history">
        <h3>Retiros</h3>
        {data.withdrawals.length ? (
          data.withdrawals.map((w) => (
            <div className="partner-history-row" key={w.id}>
              <span>
                <strong>{money(w.amountCents)}</strong>
                <small>
                  {new Date(w.createdAt).toLocaleDateString("es")} ·{" "}
                  {statusLabel[w.status]}
                </small>
                {w.note && <small>{w.note}</small>}
              </span>
              <span className="partner-status">{statusLabel[w.status]}</span>
            </div>
          ))
        ) : (
          <div className="partner-empty">
            <Icon name="lucide:wallet" />
            <p>Aún no has solicitado retiros.</p>
            <small>Tu historial aparecerá aquí.</small>
          </div>
        )}
      </section>
    </div>
  );
}
