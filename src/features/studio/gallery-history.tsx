export default function GalleryHistory({
  history,
  count,
  closedCount,
  loading,
  onToggle,
}: {
  history: boolean;
  count: number;
  closedCount: number;
  loading: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="gallery-section-heading">
      <div>
        <h2>{history ? "Invitaciones terminadas" : "Mis invitaciones"}</h2>
        <span>
          {loading
            ? "Cargando…"
            : `${count} ${count === 1 ? "invitación" : "invitaciones"}`}{" "}
          · Recientes primero
        </span>
      </div>
      {(closedCount > 0 || history) && (
        <button type="button" className="plain-button" onClick={onToggle}>
          {history ? "Volver a activas" : `Ver terminadas (${closedCount})`}
        </button>
      )}
    </div>
  );
}
