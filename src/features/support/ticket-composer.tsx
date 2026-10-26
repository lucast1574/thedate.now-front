"use client";
import { useRef, useState, type FormEvent } from "react";
import ActionButton from "@/components/action-button";
import Alert from "@/components/alert";
import Icon from "@/components/icon";
import Photo from "@/components/photo";
import { api } from "@/lib/api/client";
import {
  submissionFor,
  type Screenshot,
  type Ticket,
} from "@/lib/support/types";
import { prepareScreenshot } from "./screenshots";

export default function TicketComposer({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [title, setTitle] = useState(""),
    [description, setDescription] = useState("");
  const [images, setImages] = useState<Screenshot[]>([]);
  const [busy, setBusy] = useState(false),
    [preparing, setPreparing] = useState(false);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const submission = useRef<{ key: string; payload: string } | null>(null),
    sending = useRef(false);
  async function attach(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    if (images.length + files.length > 3) {
      setError("Puedes adjuntar hasta tres capturas.");
      return;
    }
    setPreparing(true);
    try {
      const prepared = await Promise.all(
        Array.from(files).map(prepareScreenshot),
      );
      setImages((previous) => [...previous, ...prepared]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPreparing(false);
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending.current || preparing) return;
    sending.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    const fields = {
      title: title.trim(),
      description: description.trim(),
      images: images.map((img) => img.data),
    };
    submission.current = submissionFor(
      submission.current,
      JSON.stringify(fields),
      () => crypto.randomUUID(),
    );
    try {
      await api<Ticket>("/api/backend/support/tickets", "POST", {
        ...fields,
        requestId: submission.current.key,
      });
      setTitle("");
      setDescription("");
      setImages([]);
      submission.current = null;
      setNotice("Reporte recibido. Puedes seguir su estado en Mis reportes.");
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  return (
    <form
      className="account-card support-composer"
      onSubmit={submit}
      aria-busy={busy}
    >
      <div className="support-section-head">
        <div>
          <p className="office-kicker">CUÉNTANOS QUÉ OCURRIÓ</p>
          <h2>Reportar un problema</h2>
        </div>
        <Icon name="ticket" />
      </div>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      <fieldset disabled={busy}>
        <label>
          Asunto
          <input
            required
            minLength={3}
            maxLength={140}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Por ejemplo: no puedo guardar mi invitación"
          />
        </label>
        <label>
          Descripción
          <textarea
            required
            minLength={10}
            maxLength={10000}
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="¿Qué intentabas hacer? ¿Qué ocurrió? Cuéntanos los pasos para poder revisarlo."
          />
        </label>
        <div className="support-attachment-heading">
          <span>
            Capturas de pantalla <small>Opcional · hasta 3</small>
          </span>
          <label className="support-upload">
            <Icon name="image" />
            <span>{preparing ? "Preparando…" : "Adjuntar capturas"}</span>
            <input
              type="file"
              aria-label="Adjuntar capturas"
              accept="image/png,image/jpeg,image/webp"
              multiple
              disabled={preparing || images.length >= 3}
              onChange={(event) => {
                void attach(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="support-hint">
          Las capturas se optimizan antes de enviarlas. Evita incluir
          contraseñas o datos de tus invitados.
        </p>
        {images.length > 0 && (
          <div className="support-previews">
            {images.map((image, index) => (
              <div key={`${image.name}-${index}`}>
                <Photo
                  src={image.data}
                  alt={`Captura ${index + 1}: ${image.name}`}
                />
                <button
                  type="button"
                  aria-label={`Quitar captura ${index + 1}`}
                  onClick={() =>
                    setImages((previous) =>
                      previous.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Icon name="close" />
                </button>
                <span>{image.name}</span>
              </div>
            ))}
          </div>
        )}
        <ActionButton type="submit" disabled={busy || preparing}>
          {busy ? "Enviando reporte…" : "Enviar reporte"}
          <Icon name="arrow" />
        </ActionButton>
      </fieldset>
    </form>
  );
}
