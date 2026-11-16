import { useTranslator } from "@/lib/i18n/react";
export default function CourtesyNotice() {
  const i18n = useTranslator();

  return (
    <section className="demo-continuity-note" role="status">
      <h2>{i18n("Tienes una invitación gratis")}</h2>
      <p>
        {i18n(
          "Tu cortesía se usará al crear tu próxima invitación. Es válida una sola vez.",
        )}
      </p>
    </section>
  );
}
