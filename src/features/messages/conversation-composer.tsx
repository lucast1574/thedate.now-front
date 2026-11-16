import { useId } from "react";
import { useTranslator } from "@/lib/i18n/react";

export default function ConversationComposer({
  recipient,
  busy,
  send,
  text,
  onTextChange,
}: {
  recipient: string;
  busy: boolean;
  send: (text: string) => Promise<boolean | undefined>;
  text: string;
  onTextChange: (value: string) => void;
}) {
  const i18n = useTranslator();
  const hintId = useId();
  return (
    <form
      className="inbox-composer"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!text.trim() || busy) return;
        if (await send(text.trim())) onTextChange("");
      }}
    >
      <label>
        {i18n("Respuesta por WhatsApp")}
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key !== "Enter" ||
              e.shiftKey ||
              e.altKey ||
              e.ctrlKey ||
              e.metaKey ||
              e.nativeEvent.isComposing ||
              e.keyCode === 229
            )
              return;
            e.preventDefault();
            if (!e.repeat && !busy && text.trim())
              e.currentTarget.form?.requestSubmit();
          }}
          aria-describedby={hintId}
          required
          maxLength={4000}
          readOnly={busy}
        />
      </label>
      <small id={hintId} className="inbox-composer-hint">
        {i18n("Enter para enviar · Shift + Enter para añadir una línea")}
      </small>
      <div>
        <small>{i18n("Para {v0}", { v0: recipient })}</small>
        <button className="office-button" disabled={busy || !text.trim()}>
          {busy ? i18n("Enviando…") : i18n("Enviar respuesta")}
        </button>
      </div>
    </form>
  );
}
