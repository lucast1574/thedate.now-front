"use client";
import { useState } from "react";
import Icon from "@/components/icon";
import PreviewWatermark from "./preview-watermark";
import PreviewViewport from "./preview-viewport";
import type { Event } from "@/lib/events/types";
export default function DesignPreview({ draft }: { draft: Event }) {
  const [guestName, setGuestName] = useState("María Rojas");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  return (
    <section
      className="editor-preview"
      aria-label="Vista previa de la invitación"
    >
      <div className="preview-toolbar">
        <div
          className="preview-device-tabs"
          role="group"
          aria-label="Dispositivo de la vista previa"
        >
          <button
            type="button"
            aria-pressed={device === "mobile"}
            onClick={() => setDevice("mobile")}
          >
            <Icon name="lucide:smartphone" /> Móvil
          </button>
          <button
            type="button"
            aria-pressed={device === "desktop"}
            onClick={() => setDevice("desktop")}
          >
            <Icon name="lucide:monitor" /> Escritorio
          </button>
        </div>
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
      </div>
      <div className="preview-stage-wrap">
        <PreviewViewport
          key={device}
          draft={draft}
          device={device}
          guestName={guestName}
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
