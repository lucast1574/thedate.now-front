"use client";
import { useTranslator } from "@/lib/i18n/react";

import Listbox from "@/components/listbox";
import { useState } from "react";
import type { User } from "@/lib/events/types";
import type { Run } from "@/lib/account/types";
import { api } from "@/lib/api/client";
export default function AdminUsers({
  wedding,
  users,
  current,
  busy,
  run,
}: {
  wedding: boolean;
  users: (User & { roleProtected?: boolean })[];
  current: User;
  busy: boolean;
  run: Run;
}) {
  const i18n = useTranslator();

  const [query, setQuery] = useState("");
  const filtered = users.filter((u) =>
    (u.name + u.email).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="account-card">
      <p className="office-kicker">{i18n("ROLES Y CUENTAS")}</p>
      <h2>{i18n("Un acceso claro para cada persona.")}</h2>
      <p>
        {i18n(
          "Puedes asignar roles a cuentas de Google o de correo y contraseña. Al cambiar un rol se cierran las sesiones anteriores; la cuenta principal está protegida.",
        )}
      </p>
      <label>
        {i18n("Buscar entre las 100 cuentas más recientes")}{" "}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={i18n("Nombre o correo")}
        />
      </label>
      <div className="account-table-wrap">
        <table className="account-table">
          <thead>
            <tr>
              <th>{i18n("Persona")}</th>
              <th>{i18n("Correo")}</th>
              <th>{i18n("Rol")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <Listbox
                    aria-label={i18n("Rol de {v0}", { v0: u.name })}
                    value={u.role}
                    disabled={busy || u.id === current.id || u.roleProtected}
                    onValueChange={(value) =>
                      void run(
                        () =>
                          api(
                            `/api/backend/admin/users/${u.id}/role`,
                            "PATCH",
                            { role: value },
                            i18n,
                          ),
                        i18n(
                          "Rol actualizado. La persona deberá iniciar sesión nuevamente.",
                        ),
                      )
                    }
                  >
                    <option value="user">{i18n("Usuario")}</option>
                    <option value={wedding ? "planner" : "organizer"}>
                      {wedding
                        ? i18n("Wedding planner")
                        : i18n("Organizador de eventos")}
                    </option>
                    <option value="admin">{i18n("Administrador")}</option>
                  </Listbox>
                  {(u.roleProtected || u.id === current.id) && (
                    <small>{i18n("Cuenta protegida")}</small>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
