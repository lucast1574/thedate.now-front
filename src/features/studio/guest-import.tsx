"use client";
import { useState } from "react";
import type { GuestFields } from "@/lib/events/types";
import {
  readGuestFile,
  downloadGuestTemplate,
} from "@/lib/events/guest-spreadsheet";
import { api } from "@/lib/api/client";
export default function GuestImport({
  eventId,
  onImported,
}: {
  eventId: string;
  onImported: () => Promise<void>;
}) {
  const [rows, setRows] = useState<GuestFields[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function importRows() {
    setBusy(true);
    try {
      const result = await api<{ added: number; skipped: number }>(
        `/api/backend/events/${eventId}/guests/import`,
        "POST",
        { guests: rows },
      );
      setNotice(
        `${result.added} invitados añadidos; ${result.skipped} teléfonos ya existentes omitidos.`,
      );
      setRows([]);
      await onImported();
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="guest-import">
      <h3>Importar lista de invitados</h3>
      <p className="guest-hint">
        Excel (.xlsx, primera hoja, 2 MB) o CSV (200 KB), hasta 500 filas.
        Nombre y teléfono son obligatorios; usa +código de país y formato de
        texto para teléfono. Cupos incluye al titular y sus acompañantes (1–20).
      </p>
      <p className="guest-hint">
        Apellido y familia permiten agrupar mesas. Género: hombre, mujer o sin
        especificar. Separa varios nombres, apellidos y géneros de acompañantes
        con |, en el mismo orden. Deja esos campos vacíos si el invitado los
        registrará. Las filas no confirman asistencia. Los teléfonos existentes
        se omiten.
      </p>
      <div className="action-row">
        <button
          type="button"
          onClick={() => {
            void downloadGuestTemplate("xlsx").catch((e) =>
              setNotice(e.message),
            );
          }}
        >
          Plantilla Excel ↓
        </button>
        <button
          type="button"
          onClick={() => {
            void downloadGuestTemplate("csv").catch((e) =>
              setNotice(e.message),
            );
          }}
        >
          Plantilla CSV ↓
        </button>
      </div>
      <input
        aria-label="Seleccionar Excel o CSV de invitados"
        type="file"
        accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        disabled={busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          setRows([]);
          setNotice("");
          if (!file) return;
          try {
            const parsed = await readGuestFile(file);
            setRows(parsed);
          } catch (error) {
            setNotice((error as Error).message);
          }
        }}
      />
      {rows.length > 0 && (
        <>
          <p>{rows.length} invitados listos. Primeras filas:</p>
          <ul>
            {rows.slice(0, 3).map((row, n) => (
              <li key={n}>
                {row.name} · {row.phone} · {row.seats} cupos
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="office-button"
            disabled={busy}
            onClick={importRows}
          >
            {busy ? "Importando…" : `Importar ${rows.length} invitados`}
          </button>
        </>
      )}
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
