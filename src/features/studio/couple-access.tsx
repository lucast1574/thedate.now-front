"use client";
import ActionButton from "@/components/action-button";
import { useState, type FormEvent } from "react";
import type { AccountFields } from "@/lib/events/types";
export default function CoupleAccess({
  busy,
  onCreate,
}: {
  busy: boolean;
  onCreate: (fields: AccountFields) => Promise<boolean>;
}) {
  const [coupleAccount, setCoupleAccount] = useState<AccountFields>({
    name: "",
    email: "",
    password: "",
  });
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (await onCreate(coupleAccount))
      setCoupleAccount({ name: "", email: "", password: "" });
  }
  return (
    <section className="couple-access">
      <div className="office-divider" />
      <p className="office-kicker">ACCESO PARA LA PAREJA</p>
      <h2>Planeen juntos.</h2>
      <p>
        Crea hasta dos cuentas para la pareja. La contraseña solo se muestra
        mientras la escribes.
      </p>
      <form onSubmit={submit}>
        <input
          required
          placeholder="Nombre"
          value={coupleAccount.name}
          onChange={(e) =>
            setCoupleAccount({ ...coupleAccount, name: e.target.value })
          }
        />
        <input
          type="email"
          required
          placeholder="Correo de la pareja"
          value={coupleAccount.email}
          onChange={(e) =>
            setCoupleAccount({ ...coupleAccount, email: e.target.value })
          }
        />
        <input
          type="password"
          required
          minLength={10}
          placeholder="Contraseña (mínimo 10 caracteres)"
          value={coupleAccount.password}
          onChange={(e) =>
            setCoupleAccount({ ...coupleAccount, password: e.target.value })
          }
        />
        <ActionButton className="office-button" disabled={busy}>
          Crear cuenta
        </ActionButton>
      </form>
    </section>
  );
}
