"use client";
import { useTranslator } from "@/lib/i18n/react";

import Listbox from "@/components/listbox";
import ActionButton from "@/components/action-button";
import CompanionFields from "@/components/companion-fields";
import { useState, type FormEvent } from "react";
import type { GuestFields, Kind } from "@/lib/events/types";
import { guestCategoriesFor } from "@/lib/events/guest-categories";
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
  kind = "wedding",
}: {
  busy: boolean;
  kind?: Kind;
  onAdd: (fields: GuestFields) => Promise<boolean>;
}) {
  const i18n = useTranslator();

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
      <h3>{i18n("Añadir invitado manualmente")}</h3>
      <div className="manager-fields">
        <label>
          {i18n("Nombre")}{" "}
          <input
            required
            minLength={2}
            maxLength={120}
            value={guest.name}
            onChange={(e) => setGuest({ ...guest, name: e.target.value })}
          />
        </label>
        <label>
          {i18n("Apellido (opcional)")}{" "}
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
          {i18n("Acompañantes permitidos")}{" "}
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
            <option value="0">{i18n("Sin acompañante")}</option>
            <option value="1">{i18n("Con un acompañante (+1)")}</option>
          </Listbox>
        </label>
        <label>
          {kind === "general"
            ? i18n("Grupo para mesas (opcional)")
            : i18n("Categoría para mesas (opcional)")}
          <Listbox
            value={guest.family}
            onValueChange={(family) => setGuest({ ...guest, family })}
          >
            <option value="">
              {kind === "general" ? i18n("Sin grupo") : i18n("Sin categoría")}
            </option>
            {guestCategoriesFor(kind, i18n).map((category) => (
              <option key={i18n(category)} value={i18n(category)}>
                {i18n(category)}
              </option>
            ))}
          </Listbox>
        </label>
        <label>
          {i18n("Género (opcional)")}{" "}
          <Listbox
            value={guest.gender}
            onValueChange={(value) =>
              setGuest({
                ...guest,
                gender: value as GuestFields["gender"],
              })
            }
          >
            <option value="unspecified">{i18n("Sin especificar")}</option>
            <option value="man">{i18n("Hombre")}</option>
            <option value="woman">{i18n("Mujer")}</option>
          </Listbox>
        </label>
      </div>
      <p className="guest-hint">
        {i18n("Esta invitación permite hasta")} {guest.seats}{" "}
        {guest.seats === 1
          ? i18n("persona: solo el titular.")
          : i18n("personas, contando al titular.")}{" "}
        {i18n(
          "El invitado registrará a sus acompañantes al confirmar. El grupo solo sirve para organizar las mesas.",
        )}
      </p>
      {guest.seats > 1 && (
        <details>
          <summary>{i18n("Registrar sus nombres ahora (opcional)")}</summary>
          <CompanionFields
            people={guest.companions || []}
            max={guest.seats - 1}
            description={i18n(
              "Añade los nombres si ya los conoces. La asistencia se confirma por separado.",
            )}
            onChange={(companions) => setGuest({ ...guest, companions })}
          />
        </details>
      )}
      <ActionButton className="office-button" disabled={busy}>
        {i18n("Añadir invitado")}
      </ActionButton>
    </form>
  );
}
