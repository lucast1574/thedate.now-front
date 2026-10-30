export default function SeatingOverview({
  tables,
  count,
  pending,
}: {
  tables: number;
  count: number;
  pending: number;
}) {
  return (
    <header className="seating-overview">
      <div>
        <h2>Organiza las mesas</h2>
        <p>
          Los invitados se ubican automáticamente al confirmar. Revisa la
          distribución, completa las mesas o ajusta lo que necesites.
        </p>
      </div>
      <dl className="seating-overview-counts">
        <div>
          <dt>Mesas</dt>
          <dd>{tables}</dd>
        </div>
        <div>
          <dt>Personas ubicadas</dt>
          <dd>{count}</dd>
        </div>
        <div data-pending={pending > 0}>
          <dt>Sin mesa</dt>
          <dd>{pending}</dd>
        </div>
      </dl>
    </header>
  );
}
