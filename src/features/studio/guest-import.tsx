"use client";
import Icon from "@/components/icon";
import GuestFileDropzone from "./guest-file-dropzone";
import GuestImportReceipt, { GuestImportReview } from "./guest-import-receipt";
import { useGuestImport } from "./use-guest-import";

export default function GuestImport({
  eventId,
  onImported,
  disabled = false,
}: {
  eventId: string;
  onImported: () => Promise<void>;
  disabled?: boolean;
}) {
  const {
    busy,
    locked,
    notice,
    issues,
    receipt,
    complete,
    failed,
    fileName,
    read,
    template,
    reportError,
  } = useGuestImport(eventId, disabled, onImported);
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
        complete={complete}
        uploaded={!!receipt}
        onError={reportError}
      >
        {complete && receipt && <GuestImportReceipt result={receipt} />}
      </GuestFileDropzone>
      {receipt && <GuestImportReview result={receipt} />}
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
