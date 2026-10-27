"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
export function giftToken(value: string) {
  const raw = value.trim();
  if (/^[a-f0-9]{48}$/.test(raw)) return raw;
  try {
    const path = new URL(raw).pathname;
    return /^\/(?:rsvp|regalos)\/([a-f0-9]{48})\/?$/.exec(path)?.[1] || "";
  } catch {
    return "";
  }
}
export default function GiftCodeEntry({
  onEnter,
  example = "",
}: {
  onEnter?: (token: string) => void;
  example?: string;
}) {
  const [value, setValue] = useState(example),
    [error, setError] = useState("");
  const router = useRouter();
  return (
    <main className="gift-code-page">
      <Icon name="lucide:gift" />
      {onEnter ? (
        <h2>Tu invitación abre la lista</h2>
      ) : (
        <h1>Tu invitación abre la lista</h1>
      )}
      <p>
        Entra con el enlace personal que recibiste por WhatsApp. No necesitas
        crear una cuenta.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const token = giftToken(value);
          if (!token) {
            setError("Pega tu enlace de invitación o su código completo.");
            return;
          }
          if (onEnter) onEnter(token);
          else router.push(`/regalos/${token}`);
        }}
      >
        <label>
          Tu código o enlace de invitación
          <input
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder="Pega aquí tu enlace de WhatsApp"
            required
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button className="gift-primary">Ver lista de regalos</button>
      </form>
      <div className="gift-entry-help">
        <Icon name="lock" />
        <p>
          Usa el mismo enlace con el que confirmas tu asistencia. Así guardamos
          tu elección y evitamos regalos repetidos.
        </p>
      </div>
    </main>
  );
}
