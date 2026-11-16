import { useTranslator } from "@/lib/i18n/react";
import { useId, useRef } from "react";

export default function InvitationMessageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const i18n = useTranslator();

  const input = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  return (
    <div className="invitation-message-input">
      <label htmlFor={id}>{i18n("Mensaje de WhatsApp")}</label>
      <textarea
        ref={input}
        id={id}
        rows={6}
        maxLength={4000}
        value={value}
        aria-describedby={`${id}-hint`}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="invitation-message-tools">
        <small id={`${id}-hint`}>
          {i18n(
            "El enlace a la invitación se incluirá automáticamente al inicio del mensaje para que WhatsApp genere la vista previa.",
          )}
        </small>
      </div>
    </div>
  );
}
