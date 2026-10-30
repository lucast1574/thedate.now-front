import type { ReactNode } from "react";
export default function SeatingEmptyInspector({
  actions,
}: {
  actions?: ReactNode;
}) {
  return (
    <aside className="seating-instructions seating-organizer-empty">
      <div>
        <h3>Organiza tu salón</h3>
        <p>
          Usa el + del plano para añadir mesas y espacios. Selecciona una mesa
          para editarla.
        </p>
      </div>
      {actions}
    </aside>
  );
}
