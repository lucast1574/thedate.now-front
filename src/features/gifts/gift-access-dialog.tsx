"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { CountryCode } from "libphonenumber-js";
import Icon from "@/components/icon";
import GuestPhoneField from "@/features/studio/guest-phone-field";
import { guestPhone } from "@/lib/events/guest-phone";
import { api } from "@/lib/api/client";
export default function GiftAccessDialog({
  title,
  giftId,
  onClose,
}: {
  title: string;
  giftId: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    heading = useId(),
    sending = useRef(false);
  const [country, setCountry] = useState<CountryCode>("PE"),
    [phone, setPhone] = useState("");
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const current = dialog.current;
    current?.showModal();
    current?.querySelector("input")?.focus();
    return () => {
      current?.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (sent) dialog.current?.querySelector("h2")?.focus();
  }, [sent]);
  async function send() {
    if (sending.current) return;
    let value: string;
    try {
      value = guestPhone(phone, country);
    } catch (e) {
      setError((e as Error).message);
      return;
    }
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      await api("/api/gift-catalog/access", "POST", { phone: value, giftId });
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="gift-confirmation gift-access-dialog"
      aria-labelledby={heading}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="gift-confirmation-body">
        <button
          type="button"
          className="gift-icon-button"
          aria-label="Cerrar acceso"
          disabled={busy}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <Icon name={sent ? "check" : "lucide:gift"} />
        <h2 id={heading} tabIndex={-1}>
          {sent ? "Revisa tu WhatsApp" : "Guarda tu elección a tu nombre"}
        </h2>
        {sent ? (
          <>
            <p role="status">
              Si este número está en la lista de invitados, recibirás tu acceso
              personal por WhatsApp. Ábrelo para elegir tu regalo.
            </p>
            <p>
              Usa el número con el que recibiste la invitación. Si no llega,
              revisa esa conversación o consulta con quien organiza.
            </p>
            <button className="gift-primary" onClick={onClose}>
              Volver a los regalos
            </button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <p>
              Para elegir «{title}», te enviamos tu acceso al WhatsApp donde
              recibiste la invitación. No necesitas copiar enlaces ni crear una
              cuenta.
            </p>
            <GuestPhoneField
              country={country}
              value={phone}
              error={error}
              disabled={busy}
              onCountry={setCountry}
              onChange={setPhone}
            />
            <button className="gift-primary" disabled={busy}>
              {busy ? "Solicitando acceso…" : "Recibir mi acceso por WhatsApp"}
            </button>
            <small>
              El regalo seguirá disponible hasta que completes la reserva.
            </small>
          </form>
        )}
      </div>
    </dialog>
  );
}
