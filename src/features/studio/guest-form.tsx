"use client";
import Listbox from "@/components/listbox";
import ActionButton from "@/components/action-button";
import CompanionFields from "@/components/companion-fields";
import { useState, type FormEvent } from "react";
import type { GuestFields } from "@/lib/events/types";
import { guestCategories } from "@/lib/events/guest-categories";
import { guestPhone } from "@/lib/events/guest-phone";
import GuestPhoneField from "./guest-phone-field";
import type { CountryCode } from "libphonenumber-js";
const blank = (): GuestFields => ({
  name: "",
  lastName: "",
  phone: "",
  seats: 1,
  family: "",
  gender: "unspecified",
  companions: [],
});
export default function GuestForm({
  busy,
  onAdd,
}: {
  busy: boolean;
  onAdd: (fields: GuestFields) => Promise<boolean>;
}) {
  const [guest, setGuest] = useState(blank);
  const [country, setCountry] = useState<CountryCode>("PE");
  const [phoneError, setPhoneError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    let phone: string;
    try {
      phone = guestPhone(guest.phone, country);
    } catch (error) {
      setPhoneError((error as Error).message);
      return;
    }
    if (await onAdd({ ...guest, phone })) setGuest(blank());
  }
  return (
    <form className="manual-guest" onSubmit={submit}>
      <h3>Añadir invitado manualmente</h3>
      <div className="manager-fields">
        <label>
          Nombre
          <input
            required
            minLength={2}
            maxLength={120}
            value={guest.name}
            onChange={(e) => setGuest({ ...guest, name: e.target.value })}
          />
        </label>
        <label>
          Apellido (opcional)
          <input
            maxLength={80}
            value={guest.lastName}
            onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
          />
        </label>
        <GuestPhoneField
          country={country}
          value={guest.phone}
          error={phoneError}
          disabled={busy}
          onCountry={(code) => {
            setCountry(code);
            setPhoneError("");
          }}
          onChange={(phone) => {
            setGuest({ ...guest, phone });
            setPhoneError("");
          }}
        />
        <label>
          Acompañantes permitidos
          <Listbox
            value={String(guest.seats - 1)}
            onValueChange={(value) => {
              const seats = Number(value) + 1;
              setGuest({
                ...guest,
                seats,
                companions: guest.companions?.slice(0, Math.max(0, seats - 1)),
              });
            }}
          >
            <option value="0">Sin acompañante</option>
            <option value="1">Con un acompañante (+1)</option>
          </Listbox>
        </label>
        <label>
          Categoría para mesas (opcional)
          <Listbox
            value={guest.family}
            onValueChange={(family) => setGuest({ ...guest, family })}
          >
            <option value="">Sin categoría</option>
            {guestCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Listbox>
        </label>
        <label>
          Género (opcional)
          <Listbox
            value={guest.gender}
            onValueChange={(value) =>
              setGuest({
                ...guest,
                gender: value as GuestFields["gender"],
              })
            }
          >
            <option value="unspecified">Sin especificar</option>
            <option value="man">Hombre</option>
            <option value="woman">Mujer</option>
          </Listbox>
        </label>
      </div>
      <p className="guest-hint">
        Esta invitación permite hasta {guest.seats}{" "}
        {guest.seats === 1
          ? "persona: solo el titular."
          : "personas, contando al titular."}{" "}
        El invitado registrará a sus acompañantes al confirmar. El grupo solo
        sirve para organizar las mesas.
      </p>
      {guest.seats > 1 && (
        <details>
          <summary>Registrar sus nombres ahora (opcional)</summary>
          <CompanionFields
            people={guest.companions || []}
            max={guest.seats - 1}
            description="Añade los nombres si ya los conoces. La asistencia se confirma por separado."
            onChange={(companions) => setGuest({ ...guest, companions })}
          />
        </details>
      )}
      <ActionButton className="office-button" disabled={busy}>
        Añadir invitado
      </ActionButton>
    </form>
  );
}
