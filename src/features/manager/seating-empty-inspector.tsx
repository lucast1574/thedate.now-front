import { useTranslator } from "@/lib/i18n/react";
import type { ReactNode } from "react";
export default function SeatingEmptyInspector({
  actions,
}: {
  actions?: ReactNode;
}) {
  const i18n = useTranslator();

  return (
    <aside className="seating-instructions seating-organizer-empty">
      <div>
        <h3>{i18n("Organiza tu salón")}</h3>
        <p>
          {i18n(
            "Usa el + del plano para añadir mesas y espacios. Selecciona una mesa para editarla.",
          )}
        </p>
      </div>
      {actions}
    </aside>
  );
}
