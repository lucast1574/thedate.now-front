import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
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
  const i18n = useTranslator();

  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => {
      if (trigger?.isConnected) trigger.focus();
    };
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
        <h2 id="proposal-title">
          {i18n("Revisar distribución por categoría")}
        </h2>
        <button onClick={onClose} aria-label={i18n("Cerrar propuesta")}>
          <Icon name="close" />
        </button>
      </header>
      <p>
        {assigned} {i18n("de")} {proposal.total} {i18n("personas en")}{" "}
        {proposal.plan.tables.length}{" "}
        {i18n("mesas. Se mantiene al titular con sus acompañantes.")}{" "}
        {proposal.splitFamilies}{" "}
        {i18n("categorías ocupan varias mesas por falta de espacio.")}
      </p>
      <p>
        {i18n(
          "Se agrupan los confirmados por su categoría, respetando las mesas que ya elegiste.",
        )}
      </p>
      {proposal.unnamed > 0 && (
        <p className="manager-warning">
          {proposal.unnamed}{" "}
          {i18n("acompañantes aún no tienen nombre registrado.")}
        </p>
      )}
      {proposal.unassigned.length > 0 && (
        <>
          <h3>
            {i18n("Sin asiento (")}
            {proposal.unassigned.length})
          </h3>
          <p>
            {i18n(
              "Falta capacidad de mesa o aforo. Añade mesas o revisa los cupos. No se separan los acompañantes de su titular automáticamente.",
            )}
          </p>
          <ul>
            {proposal.unassigned.slice(0, 30).map((p) => (
              <li key={p.id}>
                {fullName(p)} · {p.family || i18n("Sin familia indicada")}
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
        {i18n(
          "Al aplicar la propuesta, las asignaciones y el plano se guardan automáticamente.",
        )}
      </p>
      <footer>
        <button onClick={onClose}>{i18n("Cancelar")}</button>
        <button className="office-button" onClick={onApply}>
          {i18n("Aplicar distribución")}
        </button>
      </footer>
    </dialog>
  );
}
