"use client";
import { useRef, useState } from "react";
import type { GuestFields } from "@/lib/events/types";
import {
  readGuestFile,
  downloadGuestTemplate,
} from "@/lib/events/guest-spreadsheet";
import { api } from "@/lib/api/client";
import Icon from "@/components/icon";
import GuestFileDropzone from "./guest-file-dropzone";

export default function GuestImport({
  eventId,
  onImported,
  disabled = false,
}: {
  eventId: string;
  onImported: () => Promise<void>;
  disabled?: boolean;
}) {
  const reading = useRef(false);
  const [rows, setRows] = useState<GuestFields[]>([]);
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const locked = busy || disabled;
  async function read(file?: File) {
    if (!file || locked || reading.current) return;
    reading.current = true;
    setBusy(true);
    setRows([]);
    setNotice("");
    setFailed(false);
    setFileName(file.name);
    try {
      setRows(await readGuestFile(file));
    } catch (error) {
      setFailed(true);
      setNotice((error as Error).message);
    } finally {
      reading.current = false;
      setBusy(false);
    }
  }
  async function importRows() {
    if (locked || reading.current) return;
    reading.current = true;
    setBusy(true);
    setFailed(false);
    setNotice("");
    try {
      const result = await api<{ added: number; skipped: number }>(
        `/api/backend/events/${eventId}/guests/import`,
        "POST",
        { guests: rows },
      );
      setNotice(
        `${result.added} invitados añadidos en el orden del archivo.${result.skipped ? ` Omitimos ${result.skipped} teléfonos que ya estaban en tu lista.` : ""}`,
      );
      setRows([]);
      setFileName("");
      await onImported();
    } catch (error) {
      setFailed(true);
      setNotice((error as Error).message);
    } finally {
      reading.current = false;
      setBusy(false);
    }
  }
  async function template() {
    try {
      await downloadGuestTemplate();
    } catch (error) {
      setFailed(true);
      setNotice((error as Error).message);
    }
  }
  return (
    <section
      className="guest-import guest-file-card"
      aria-labelledby={`import-title-${eventId}`}
    >
      <div className="guest-method-heading">
        <Icon name="table" />
        <div>
          <h3 id={`import-title-${eventId}`}>Sube tu lista de invitados</h3>
          <p>
            Una fila por persona titular, en el orden en que quieres invitar.
          </p>
        </div>
      </div>
      <div className="guest-template-actions">
        <button type="button" disabled={locked} onClick={() => void template()}>
          <Icon name="down" />
          Descargar plantilla Excel
        </button>
      </div>
      <GuestFileDropzone
        locked={locked}
        busy={busy}
        fileName={fileName}
        onRead={read}
        onError={(message) => {
          setFailed(true);
          setNotice(message);
        }}
      />
      <p className="guest-file-tip">
        Indica los acompañantes permitidos: 0 para ir solo, 1 para un +1. El
        titular se cuenta aparte. Puede registrar sus acompañantes al confirmar.
      </p>
      {rows.length > 0 && (
        <div className="guest-import-review">
          <h4>{rows.length} invitaciones listas para añadir</h4>
          <p>Así empieza tu lista. Conservaremos este orden.</p>
          <ol>
            {rows.slice(0, 5).map((row, index) => (
              <li key={index}>
                <strong>
                  {row.name} {row.lastName}
                </strong>
                <span>
                  {row.phone} · {row.seats} {row.seats === 1 ? "cupo" : "cupos"}
                </span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="office-button"
            disabled={locked}
            onClick={() => void importRows()}
          >
            {busy
              ? "Añadiendo invitados…"
              : `Añadir ${rows.length} invitaciones a mi lista`}
          </button>
        </div>
      )}
      {notice && (
        <p
          className={`guest-import-notice ${failed ? "is-error" : ""}`}
          role={failed ? "alert" : "status"}
        >
          {notice}
        </p>
      )}
    </section>
  );
}
