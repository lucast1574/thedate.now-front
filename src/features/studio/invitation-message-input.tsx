import { useId, useRef } from "react";
import {
  moveInvitationLink,
  protectInvitationEdit,
} from "@/lib/events/invitation-message";
export default function InvitationMessageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const input = useRef<HTMLTextAreaElement>(null),
    id = useId();
  function place(caret: number) {
    requestAnimationFrame(() => {
      input.current?.focus();
      input.current?.setSelectionRange(caret, caret);
    });
  }
  function move() {
    const result = moveInvitationLink(
      value,
      input.current?.selectionStart ?? value.length,
    );
    onChange(result.value);
    place(result.caret);
  }
  return (
    <div className="invitation-message-input">
      <label htmlFor={id}>Mensaje de WhatsApp</label>
      <textarea
        ref={input}
        id={id}
        rows={6}
        maxLength={4000}
        value={value}
        aria-describedby={`${id}-hint`}
        onKeyDown={(e) => {
          if (e.altKey && e.key.toLowerCase() === "l") {
            e.preventDefault();
            move();
          }
        }}
        onChange={(e) => {
          const result = protectInvitationEdit(value, e.target.value);
          onChange(result.value);
          if (result.caret !== null) place(result.caret);
        }}
      />
      <div className="invitation-message-tools">
        <small id={`${id}-hint`}>
          El marcador {"{{link}}"} no se puede borrar. Puedes escribir antes y
          después.
        </small>
      </div>
    </div>
  );
}
