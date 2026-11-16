import { useTranslator } from "@/lib/i18n/react";
import { useEffect, useRef } from "react";
export default function GiftEditorSwitch({
  name,
  busy,
  onCancel,
  onConfirm,
}: {
  name: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const i18n = useTranslator();

  const cancel = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    cancel.current?.focus({ preventScroll: true });
    return () => {
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <div
      className="gift-editor-switch"
      role="group"
      aria-label={i18n("Cambiar de regalo")}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
    >
      <strong>{i18n("Tienes cambios sin guardar")}</strong>
      <p>
        {i18n("¿Descartarlos para editar «")}
        {name}»?
      </p>
      <button
        type="button"
        className="gift-secondary"
        ref={cancel}
        disabled={busy}
        onClick={onCancel}
      >
        {i18n("Seguir aquí")}
      </button>
      <button
        type="button"
        className="gift-secondary"
        disabled={busy}
        onClick={onConfirm}
      >
        {i18n("Descartar y editar")}
      </button>
    </div>
  );
}
