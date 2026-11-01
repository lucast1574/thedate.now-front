"use client";
import { useEffect, useId, useRef } from "react";
import Icon from "@/components/icon";

export const publicationSuccessDuration = 4500;
export default function PublicationSuccess({
  title,
  onClose,
  onStart,
}: {
  title: string;
  onClose: () => void;
  onStart: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useId(),
    description = useId();
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    node.querySelector<HTMLElement>("h2")?.focus();
    onStart();
    const timer = window.setTimeout(onClose, publicationSuccessDuration);
    return () => {
      window.clearTimeout(timer);
      node.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected && previous !== document.body)
        previous.focus({ preventScroll: true });
      else {
        const destination = document.querySelector<HTMLElement>(
          ".workspace-content, main",
        );
        destination?.setAttribute("tabindex", "-1");
        destination?.focus({ preventScroll: true });
      }
    };
  }, [onClose, onStart]);
  return (
    <dialog
      ref={dialog}
      className="publication-success"
      aria-labelledby={heading}
      aria-describedby={description}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="publication-success-content">
        <button
          type="button"
          className="publication-success-close"
          onClick={onClose}
          aria-label="Cerrar confirmación"
        >
          <Icon name="close" />
        </button>
        <svg
          className="publication-success-art"
          viewBox="0 0 160 132"
          fill="none"
          aria-hidden="true"
        >
          <rect
            className="publication-success-card publication-success-card-back"
            x="26"
            y="27"
            width="63"
            height="80"
            rx="7"
          />
          <rect
            className="publication-success-card publication-success-card-front"
            x="56"
            y="18"
            width="67"
            height="86"
            rx="7"
          />
          <path
            className="publication-success-lines"
            d="M73 43H106M73 54H106M73 65H94"
          />
          <circle
            className="publication-success-seal"
            cx="113"
            cy="98"
            r="22"
          />
          <path className="publication-success-check" d="m103 98 7 7 14-15" />
        </svg>
        <h2 id={heading} tabIndex={-1}>
          Invitaciones actualizadas
        </h2>
        <p className="publication-success-event">{title}</p>
        <p id={description}>
          Los últimos cambios ya están disponibles en tus enlaces.
        </p>
      </div>
    </dialog>
  );
}
