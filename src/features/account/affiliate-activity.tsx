import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const entries = [...(data.partnerEvents || [])].sort(
    (a, b) => Date.parse(b.availableAt) - Date.parse(a.availableAt),
  );
  return (
    <div className="partner-activity">
      <section className="partner-history">
        <h3>{i18n("Comisiones")}</h3>
        {entries.length ? (
          entries.map((e) => (
            <div className="partner-history-row" key={e.eventId}>
              <span>
                <Link href={`/?event=${encodeURIComponent(e.eventId)}`}>
                  {e.title}
                </Link>
                <small>
                  {e.amount === 0
                    ? i18n("Revertida")
                    : e.credited >= e.amount
                      ? i18n("Disponible")
                      : i18n("Disponible el {v0}", {
                          v0: new Date(e.availableAt).toLocaleDateString(
                            i18n.locale,
                            {
                              day: "numeric",
                              month: "short",
                            },
                          ),
                        })}
                </small>
              </span>
              <strong>{money(e.amount, i18n.locale)}</strong>
            </div>
          ))
        ) : (
          <div className="partner-empty">
            <Icon name="sparkle" />
            <p>
              {i18n("Tu primera comisión empieza con tu próxima")}{" "}
              {wedding ? i18n("boda") : i18n("celebración")}.
            </p>
            <small>{i18n("Aparecerá aquí cuando completes el pago.")}</small>
          </div>
        )}
      </section>
      <section className="partner-history">
        <h3>{i18n("Retiros")}</h3>
        {data.withdrawals.length ? (
          data.withdrawals.map((w) => (
            <div className="partner-history-row" key={w.id}>
              <span>
                <strong>{money(w.amountCents, i18n.locale)}</strong>
                <small>
                  {new Date(w.createdAt).toLocaleDateString(i18n.locale)} ·{" "}
                  {statusLabel(i18n)[w.status]}
                </small>
                {w.note && <small>{w.note}</small>}
              </span>
              <span className="partner-status">
                {statusLabel(i18n)[w.status]}
              </span>
            </div>
          ))
        ) : (
          <div className="partner-empty">
            <Icon name="lucide:wallet" />
            <p>{i18n("Aún no has solicitado retiros.")}</p>
            <small>{i18n("Tu historial aparecerá aquí.")}</small>
          </div>
        )}
      </section>
    </div>
  );
}
