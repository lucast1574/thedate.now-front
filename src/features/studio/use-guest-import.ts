import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import {
  readGuestFileReport,
  downloadGuestTemplate,
} from "@/lib/events/guest-spreadsheet";
import type { GuestRowIssue } from "@/lib/events/guest-rows";
import type { GuestImportResult } from "@/lib/events/guest-import-result";

export function useGuestImport(
  eventId: string,
  disabled: boolean,
  onImported: () => Promise<void>,
) {
  const reading = useRef(false);
  const [notice, setNotice] = useState("");
  const [issues, setIssues] = useState<GuestRowIssue[]>([]);
  const [receipt, setReceipt] = useState<GuestImportResult | null>(null);
  const [complete, setComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const locked = busy || disabled;
  useEffect(() => {
    if (!complete) return;
    const timer = setTimeout(() => setComplete(false), 2600);
    return () => clearTimeout(timer);
  }, [complete, receipt]);
  function reportError(message: string) {
    setFailed(true);
    setNotice(message);
    setReceipt(null);
    setComplete(false);
  }
  async function read(file?: File) {
    if (!file || locked || reading.current) return;
    reading.current = true;
    setBusy(true);
    setNotice("");
    setIssues([]);
    setReceipt(null);
    setComplete(false);
    setFailed(false);
    setFileName(file.name);
    try {
      const report = await readGuestFileReport(file);
      setIssues(report.issues);
      if (!report.guests.length) {
        reportError(
          report.issues.length
            ? "No añadimos invitados. Corrige las filas indicadas y vuelve a subir el archivo."
            : "El archivo no tiene invitados. Completa la plantilla y vuelve a subirla.",
        );
        return;
      }
      const result = await api<GuestImportResult>(
        `/api/backend/events/${eventId}/guests/import`,
        "POST",
        { guests: report.guests },
      );
      setReceipt(result);
      setFileName("");
      if (report.issues.length)
        setNotice(
          "Corrige las filas indicadas y vuelve a subir el Excel. Los invitados guardados no se duplicarán.",
        );
      try {
        await onImported();
      } catch {
        setNotice(
          "La lista quedó guardada, pero no pudimos refrescarla. Recarga la página para verla.",
        );
      }
      setComplete(true);
    } catch (error) {
      reportError((error as Error).message);
    } finally {
      reading.current = false;
      setBusy(false);
    }
  }
  async function template() {
    try {
      await downloadGuestTemplate();
    } catch (error) {
      reportError((error as Error).message);
    }
  }
  return {
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
  };
}
