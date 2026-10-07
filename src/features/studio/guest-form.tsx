"use client";
import Listbox from "@/components/listbox";
import ActionButton from "@/components/action-button";
import CompanionFields from "@/components/companion-fields";
import { useState, type FormEvent } from "react";
import type { GuestFields } from "@/lib/events/types";
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
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (await onAdd(guest)) setGuest(blank());
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
          Apellido
          <input
            maxLength={80}
            value={guest.lastName}
            onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
          />
        </label>
        <label>
          WhatsApp
          <input
            required
            placeholder="+51987654321"
            pattern="\+[1-9][0-9]{6,14}"
            value={guest.phone}
            onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
          />
        </label>
        <label>
          Cupos máximos (incluye titular)
          <input
            required
            type="number"
            min={1}
            max={20}
            value={guest.seats}
            onChange={(e) => {
              const seats = Number(e.target.value);
              setGuest({
                ...guest,
                seats,
                companions: guest.companions?.slice(0, Math.max(0, seats - 1)),
              });
            }}
          />
        </label>
        <label>
          Familia / grupo
          <input
            placeholder="Familia Rojas"
            maxLength={80}
            value={guest.family}
            onChange={(e) => setGuest({ ...guest, family: e.target.value })}
          />
        </label>
        <label>
          Icono
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
        Una invitación con +1 lleva 2 cupos. Los cupos máximos no son
        confirmaciones. Puedes dejar los acompañantes pendientes para que el
        titular registre sus nombres desde su enlace de WhatsApp.
      </p>
      {guest.seats > 1 && (
        <CompanionFields
          people={guest.companions || []}
          max={guest.seats - 1}
          description="Añade los nombres si ya los conoces. La asistencia se confirma por separado."
          onChange={(companions) => setGuest({ ...guest, companions })}
        />
      )}
      <ActionButton className="office-button" disabled={busy}>
        Añadir invitado
      </ActionButton>
    </form>
  );
}
