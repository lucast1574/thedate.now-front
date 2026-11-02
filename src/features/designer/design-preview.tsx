"use client";
import { downloadInvitation } from "./download-invitation";
import { useRef, useState } from "react";
import Icon from "@/components/icon";
import PreviewWatermark from "./preview-watermark";
import PreviewViewport from "./preview-viewport";
import type { Event } from "@/lib/events/types";
export default function DesignPreview({
  draft,
  downloadable = false,
}: {
  draft: Event;
  downloadable?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const [downloading, setDownloading] = useState(false),
    [downloadError, setDownloadError] = useState("");
  const [ready, setReady] = useState(false);
  const [guestName, setGuestName] = useState("María Rojas");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  function chooseDevice(next: "mobile" | "desktop") {
    if (next === device) return;
    setReady(false);
    setDevice(next);
  }
  return (
    <section
      ref={root}
      className="editor-preview"
      aria-label="Vista previa de la invitación"
    >
      <div className="preview-toolbar">
        {downloadable && (
          <button
            type="button"
            disabled={downloading || !ready}
            onClick={async () => {
              const doc =
                root.current?.querySelector("iframe")?.contentDocument;
              if (!doc?.querySelector(".invitation")) return;
              setDownloading(true);
              setDownloadError("");
              try {
                await downloadInvitation(doc, draft.title);
              } catch (error) {
                setDownloadError((error as Error).message);
              } finally {
                setDownloading(false);
              }
            }}
          >
            <Icon name="down" />
            {!ready
              ? "Preparando invitación…"
              : downloading
                ? "Preparando descarga…"
                : "Descargar invitación"}
          </button>
        )}

        <div
          className="preview-device-tabs"
          role="group"
          aria-label="Dispositivo de la vista previa"
        >
          <button
            type="button"
            aria-pressed={device === "mobile"}
            onClick={() => chooseDevice("mobile")}
          >
            <Icon name="lucide:smartphone" /> Móvil
          </button>
          <button
            type="button"
            aria-pressed={device === "desktop"}
            onClick={() => chooseDevice("desktop")}
          >
            <Icon name="lucide:monitor" /> Escritorio
          </button>
        </div>
        {!downloadable && (
          <label className="preview-name">
            <Icon name="users" />
            <span>Invitado de ejemplo</span>
            <input
              maxLength={200}
              value={guestName}
              placeholder="Nombre del invitado"
              onChange={(e) => setGuestName(e.target.value)}
            />
          </label>
        )}
      </div>
      {downloadError && <p role="alert">{downloadError}</p>}
      <div className="preview-stage-wrap">
        <PreviewViewport
          key={device}
          draft={draft}
          device={device}
          guestName={downloadable ? "" : guestName}
          showOpening={!downloadable}
          onReady={() => setReady(true)}
        />
      </div>
      <footer className="preview-caption">
        <span>
          <Icon name="lock" /> Vista previa privada
        </span>
        {(draft.isDemo || draft.paymentStatus !== "paid") && (
          <PreviewWatermark wedding={draft.kind === "wedding"} />
        )}
        <p>Explora tu invitación desplazándote dentro de ella.</p>
      </footer>
    </section>
  );
}
