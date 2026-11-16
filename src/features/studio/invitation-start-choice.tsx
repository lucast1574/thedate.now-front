import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";

export default function InvitationStartChoice({
  blank,
  onChange,
}: {
  blank: boolean;
  onChange: (blank: boolean) => void;
}) {
  const i18n = useTranslator();

  return (
    <div
      className="invitation-start-choice"
      role="group"
      aria-label={i18n("Cómo empezar tu invitación")}
    >
      {[
        {
          blank: false,
          icon: "layout",
          title: i18n("Usar una plantilla"),
          detail: i18n("Un diseño listo para hacerlo tuyo."),
        },
        {
          blank: true,
          icon: "lucide:file",
          title: i18n("Empezar desde cero"),
          detail: i18n("Un lienzo vacío para tus ideas."),
        },
      ].map((choice) => (
        <button
          type="button"
          key={choice.title}
          aria-pressed={blank === choice.blank}
          onClick={() => onChange(choice.blank)}
        >
          <Icon name={choice.icon} />
          <span>
            <strong>{choice.title}</strong>
            <small>{choice.detail}</small>
          </span>
          <span className="invitation-start-indicator" aria-hidden="true">
            {blank === choice.blank && <Icon name="check" />}
          </span>
        </button>
      ))}
    </div>
  );
}
