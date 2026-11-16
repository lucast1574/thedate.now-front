import { useTranslator } from "@/lib/i18n/react";
import { useEffect, useId, useRef } from "react";
import Icon from "@/components/icon";
import type { GuestGift } from "@/lib/events/wishlist";
import { giftStore } from "@/lib/events/gift-store";
import GiftImage from "./gift-image";
export default function GiftConfirmation({
  item,
  release,
  image,
  busy,
  error,
  onConfirm,
  onClose,
}: {
  item: GuestGift;
  release: boolean;
  image?: string;
  busy: boolean;
  error: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const i18n = useTranslator();

  const dialog = useRef<HTMLDialogElement>(null),
    titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const current = dialog.current;
    current?.showModal();
    return () => {
      current?.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="gift-confirmation"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="gift-confirmation-body">
        <button
          className="gift-icon-button"
          aria-label={i18n("Cerrar confirmación")}
          disabled={busy}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <GiftImage src={image} title={item.title} />
        <span className="gift-merchant">{giftStore(item.url)}</span>
        <h2 id={titleId}>
          {release
            ? i18n("¿Liberar tu elección?")
            : i18n("¿Quieres regalarlo?")}
        </h2>
        <strong>{item.title}</strong>
        <p>
          {release
            ? i18n(
                "Volverá a estar disponible y podrás elegir otro regalo. Si ya lo compraste, conserva tu reserva.",
              )
            : i18n(
                "Quedará reservado a tu nombre para evitar regalos repetidos. Después podrás abrir la tienda para comprarlo.",
              )}
        </p>
        {error && (
          <p role="alert" className="gift-error">
            {error}
          </p>
        )}
        <button className="gift-primary" disabled={busy} onClick={onConfirm}>
          {busy
            ? i18n("Actualizando…")
            : release
              ? i18n("Liberar y elegir otro")
              : i18n("Sí, reservar este regalo")}
        </button>
        <button className="gift-secondary" disabled={busy} onClick={onClose}>
          {i18n("Seguir viendo")}
        </button>
      </div>
    </dialog>
  );
}
