"use client";
import { useState } from "react";
import type { User } from "@/lib/events/types";
import type { Run } from "@/lib/account/types";
import { api } from "@/lib/api/client";
export default function AdminUsers({
  users,
  current,
  busy,
  run,
}: {
  users: User[];
  current: User;
  busy: boolean;
  run: Run;
}) {
  const [query, setQuery] = useState("");
  const filtered = users.filter((u) =>
    (u.name + u.email).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="account-card">
      <p className="office-kicker">ROLES Y CUENTAS</p>
      <h2>Un acceso claro para cada persona.</h2>
      <p>
        El rol administrador requiere Google verificado. Al cambiar un rol se
        cierran las sesiones anteriores; la cuenta principal está protegida.
      </p>
      <label>
        Buscar entre las 100 cuentas más recientes
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre o correo"
        />
      </label>
      <div className="account-table-wrap">
        <table className="account-table">
          <thead>
            <tr>
              <th>Persona</th>
              <th>Correo</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    aria-label={`Rol de ${u.name}`}
                    value={u.role}
                    disabled={
                      busy ||
                      u.id === current.id ||
                      u.email === "lucasraulsantillanarevalo@gmail.com"
                    }
                    onChange={(e) =>
                      void run(
                        () =>
                          api(
                            `/api/backend/admin/users/${u.id}/role`,
                            "PATCH",
                            { role: e.target.value },
                          ),
                        "Rol actualizado. La persona deberá iniciar sesión nuevamente.",
                      )
                    }
                  >
                    <option value="organizer">Organizador</option>
                    <option value="planner">Wedding planner</option>
                    <option value="couple">Colaborador (legado)</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
