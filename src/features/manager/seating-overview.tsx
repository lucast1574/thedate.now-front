import { useTranslator } from "@/lib/i18n/react";
export default function SeatingOverview({
  tables,
  count,
  pending,
}: {
  tables: number;
  count: number;
  pending: number;
}) {
  const i18n = useTranslator();

  return (
    <header className="seating-overview">
      <div>
        <h2>{i18n("Organiza las mesas")}</h2>
        <p>
          {i18n(
            "Los invitados se ubican automáticamente al confirmar. Revisa la distribución, completa las mesas o ajusta lo que necesites.",
          )}
        </p>
      </div>
      <dl className="seating-overview-counts">
        <div>
          <dt>{i18n("Mesas")}</dt>
          <dd>{tables}</dd>
        </div>
        <div>
          <dt>{i18n("Personas ubicadas")}</dt>
          <dd>{count}</dd>
        </div>
        <div data-pending={pending > 0}>
          <dt>{i18n("Sin mesa")}</dt>
          <dd>{pending}</dd>
        </div>
      </dl>
    </header>
  );
}
