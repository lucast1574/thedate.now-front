import { useEffect, useRef } from "react";
import { fullName } from "@/lib/events/attendees";
import type { proposeSeating } from "@/lib/events/auto-seating";
export default function AutoProposal({
  proposal,
  onApply,
  onClose,
}: {
  proposal: ReturnType<typeof proposeSeating>;
  onApply: () => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  const assigned = Object.keys(proposal.plan.assignments).length;
  return (
    <dialog
      ref={dialog}
      className="auto-proposal"
      aria-labelledby="proposal-title"
      onCancel={onClose}
    >
      <header>
        <h2 id="proposal-title">Propuesta por familias</h2>
        <button onClick={onClose} aria-label="Cerrar propuesta">
          ×
        </button>
      </header>
      <p>
        {assigned} de {proposal.total} personas en {proposal.plan.tables.length}{" "}
        mesas. Se mantiene al titular con sus acompañantes.{" "}
        {proposal.splitFamilies} familias necesitan mesas separadas por falta de
        espacio.
      </p>
      <p>
        Usamos familia y luego el primer apellido. No se deducen parentescos:
        revisa los grupos, especialmente apellidos iguales.
      </p>
      {proposal.unnamed > 0 && (
        <p className="manager-warning">
          {proposal.unnamed} acompañantes aún no tienen nombre registrado.
        </p>
      )}
      {proposal.unassigned.length > 0 && (
        <>
          <h3>Sin asiento ({proposal.unassigned.length})</h3>
          <p>
            Falta capacidad de mesa o aforo. Añade mesas o revisa los cupos. No
            se separan los acompañantes de su titular automáticamente.
          </p>
          <ul>
            {proposal.unassigned.slice(0, 30).map((p) => (
              <li key={p.id}>
                {fullName(p)} · {p.family || "Sin familia indicada"}
              </li>
            ))}
          </ul>
        </>
      )}
      <ul className="proposal-tables">
        {proposal.plan.tables.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong> ·{" "}
            {
              Object.values(proposal.plan.assignments).filter(
                (id) => id === t.id,
              ).length
            }
            /{t.capacity}
          </li>
        ))}
      </ul>
      <p>
        Aplicar reemplaza las asignaciones actuales del borrador. El plano se
        guardará cuando pulses Guardar plano.
      </p>
      <footer>
        <button onClick={onClose}>Volver sin aplicar</button>
        <button className="office-button" onClick={onApply}>
          Aplicar propuesta al lienzo
        </button>
      </footer>
    </dialog>
  );
}
