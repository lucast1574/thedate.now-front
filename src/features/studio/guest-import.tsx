"use client";
import { useRef, useState } from "react";
import {
  readGuestFileReport,
  downloadGuestTemplate,
} from "@/lib/events/guest-spreadsheet";
import type { GuestRowIssue } from "@/lib/events/guest-rows";
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
  const [notice, setNotice] = useState("");
  const [issues, setIssues] = useState<GuestRowIssue[]>([]);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const locked = busy || disabled;
  async function read(file?: File) {
    if (!file || locked || reading.current) return;
    reading.current = true;
    setBusy(true);
    setNotice("");
    setIssues([]);
    setFailed(false);
    setFileName(file.name);
    try {
      const report = await readGuestFileReport(file);
      setIssues(report.issues);
      if (!report.guests.length) {
        setFailed(true);
        setNotice(
          report.issues.length
            ? "No añadimos invitados. Corrige las filas indicadas y vuelve a subir el archivo."
            : "El archivo no tiene invitados. Completa la plantilla y vuelve a subirla.",
        );
        return;
      }
      const result = await api<{ added: number; skipped: number }>(
        `/api/backend/events/${eventId}/guests/import`,
        "POST",
        { guests: report.guests },
      );
      setNotice(
        `${result.added} ${result.added === 1 ? "invitado añadido" : "invitados añadidos"} en el orden del archivo.${result.skipped ? ` ${result.skipped} ${result.skipped === 1 ? "teléfono ya estaba" : "teléfonos ya estaban"} en tu lista.` : ""}${report.issues.length ? " Corrige las filas indicadas y vuelve a subir el archivo; no se duplicarán los invitados." : ""}`,
      );
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
      {notice && (
        <p
          className={`guest-import-notice ${failed ? "is-error" : ""}`}
          role={failed ? "alert" : "status"}
        >
          {notice}
        </p>
      )}
      {issues.length > 0 && (
        <div
          className="guest-import-issues"
          role="region"
          aria-label="Filas por corregir"
        >
          <h4>
            {issues.length}{" "}
            {issues.length === 1 ? "fila por corregir" : "filas por corregir"}
          </h4>
          <ul>
            {issues.map((issue) => (
              <li key={issue.row}>
                <strong>Fila {issue.row}:</strong> {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
