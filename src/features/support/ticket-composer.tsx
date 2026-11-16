"use client";
import { useTranslator } from "@/lib/i18n/react";
import { bindTranslator } from "@/lib/i18n/translator";

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
  const i18n = useTranslator();

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
      setError(i18n("Puedes adjuntar hasta tres capturas."));
      return;
    }
    setPreparing(true);
    try {
      const prepared = await Promise.all(
        Array.from(files).map(bindTranslator(prepareScreenshot, i18n, 1)),
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
      await api<Ticket>(
        "/api/backend/support/tickets",
        "POST",
        {
          ...fields,
          requestId: submission.current.key,
        },
        i18n,
      );
      setTitle("");
      setDescription("");
      setImages([]);
      submission.current = null;
      setNotice(
        i18n("Reporte recibido. Puedes seguir su estado en Mis reportes."),
      );
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
          <p className="office-kicker">{i18n("CUÉNTANOS QUÉ OCURRIÓ")}</p>
          <h2>{i18n("Reportar un problema")}</h2>
        </div>
        <Icon name="ticket" />
      </div>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      <fieldset disabled={busy}>
        <label>
          {i18n("Asunto")}{" "}
          <input
            required
            minLength={3}
            maxLength={140}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={i18n("Por ejemplo: no puedo guardar mi invitación")}
          />
        </label>
        <label>
          {i18n("Descripción")}{" "}
          <textarea
            required
            minLength={10}
            maxLength={10000}
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={i18n(
              "¿Qué intentabas hacer? ¿Qué ocurrió? Cuéntanos los pasos para poder revisarlo.",
            )}
          />
        </label>
        <div className="support-attachment-heading">
          <span>
            {i18n("Capturas de pantalla")}{" "}
            <small>{i18n("Opcional · hasta 3")}</small>
          </span>
          <label className="support-upload">
            <Icon name="image" />
            <span>
              {preparing ? i18n("Preparando…") : i18n("Adjuntar capturas")}
            </span>
            <input
              type="file"
              aria-label={i18n("Adjuntar capturas")}
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
          {i18n(
            "Las capturas se optimizan antes de enviarlas. Evita incluir contraseñas o datos de tus invitados.",
          )}
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
                  aria-label={i18n("Quitar captura {v0}", { v0: index + 1 })}
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
          {busy ? i18n("Enviando reporte…") : i18n("Enviar reporte")}
          <Icon name="arrow" />
        </ActionButton>
      </fieldset>
    </form>
  );
}
