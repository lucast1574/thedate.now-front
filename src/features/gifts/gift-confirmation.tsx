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
          aria-label="Cerrar confirmación"
          disabled={busy}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <GiftImage src={image} title={item.title} />
        <span className="gift-merchant">{giftStore(item.url)}</span>
        <h2 id={titleId}>
          {release ? "¿Liberar tu elección?" : "¿Quieres regalarlo?"}
        </h2>
        <strong>{item.title}</strong>
        <p>
          {release
            ? "Volverá a estar disponible y podrás elegir otro regalo. Si ya lo compraste, conserva tu reserva."
            : "Quedará reservado a tu nombre para evitar regalos repetidos. Después podrás abrir la tienda para comprarlo."}
        </p>
        {error && (
          <p role="alert" className="gift-error">
            {error}
          </p>
        )}
        <button className="gift-primary" disabled={busy} onClick={onConfirm}>
          {busy
            ? "Actualizando…"
            : release
              ? "Liberar y elegir otro"
              : "Sí, reservar este regalo"}
        </button>
        <button className="gift-secondary" disabled={busy} onClick={onClose}>
          Seguir viendo
        </button>
      </div>
    </dialog>
  );
}
