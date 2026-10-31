"use client";
import { validDesignDressColors } from "@/lib/events/dress-code";
import { validMapLink } from "@/lib/events/location-element";
import { useState } from "react";
import { useDesignHistory } from "./use-design-history";
import { useDesignRecovery } from "./use-design-recovery";
import { designPayload } from "./design-state";
import { guestNameElement } from "@/lib/events/guest-name";
import { blankCanvas } from "./flyer/canvas-model";
import { api } from "@/lib/api/client";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
export function useInvitationDesign(
  event: DesignEvent,
  onSaved: () => Promise<void>,
  initialDraft?: DesignEvent,
) {
  const history = useDesignHistory(event, initialDraft);
  const { draft, setDraft } = history;
  const recovery = useDesignRecovery(event, draft, setDraft, history.dirty);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const sections = draft.sections || [];
  function updateSection(index: number, patch: Partial<DesignSection>) {
    setDraft((current) => ({
      ...current,
      sections: (current.sections || []).map((item, n) =>
        n === index ? { ...item, ...patch } : item,
      ),
    }));
  }
  function moveSection(index: number, direction: number) {
    setDraft((current) => {
      const list = [...(current.sections || [])];
      const next = index + direction;
      if (next < 0 || next >= list.length) return current;
      [list[index], list[next]] = [list[next], list[index]];
      return { ...current, sections: list };
    });
  }
  function removeSection(id: string) {
    setDraft((current) => ({
      ...current,
      sections: (current.sections || []).filter((item) => item.id !== id),
    }));
  }
  function addSection() {
    setDraft((current) => ({
      ...current,
      sections: [
        ...(current.sections || []),
        {
          id: crypto.randomUUID(),
          icon: current.kind === "wedding" ? "heart" : "star",
          heading: "Una nueva sección",
          body:
            current.kind === "wedding"
              ? "Escribe aquí vuestra historia."
              : "Añade los detalles de tu evento.",
          ...(current.designMode === "flyer"
            ? { canvas: blankCanvas(current.accentColor, current.kind) }
            : {}),
        },
      ],
    }));
  }
  function addGuestSection() {
    if (sections.length >= 20) return;
    setDraft((current) => ({
      ...current,
      sections: [
        ...(current.sections || []),
        {
          id: crypto.randomUUID(),
          icon: "none",
          heading: "Una invitación para ti",
          body: "",
          guestText: guestNameElement(current.accentColor, crypto.randomUUID()),
        },
      ],
    }));
  }
  async function save() {
    setBusy(true);
    setMessage("");
    try {
      if (!validDesignDressColors(sections))
        throw new Error(
          "Revisa los colores no permitidos del dress code: cada muestra necesita un nombre y un color válido (máximo 8).",
        );
      if (
        sections.some((section) =>
          section.canvas?.elements.some(
            (item) =>
              item.binding === "location" &&
              !item.eventBound &&
              item.link &&
              !validMapLink(item.link),
          ),
        )
      )
        throw new Error(
          "Revisa el enlace de Google Maps en la ubicación antes de guardar.",
        );
      await api(
        `/api/backend/events/${draft.id}/design`,
        "PATCH",
        designPayload(draft),
      );
      await onSaved();
      setMessage(
        draft.publishedAt
          ? "Cambios publicados. Tus invitados los verán en el mismo enlace; no necesitas reenviar ni pagar de nuevo."
          : "Diseño guardado.",
      );
      return true;
    } catch (error) {
      setMessage((error as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File) {
    setBusy(true);
    setMessage("");
    try {
      const data = new FormData();
      data.append("photo", file);
      const result = await fetch(`/api/photos/${draft.id}`, {
        method: "POST",
        body: data,
      });
      const body = await result.json();
      if (!result.ok) throw new Error(body.error || "No se pudo subir la foto");
      setDraft((current) => ({
        ...current,
        photoKeys: [...current.photoKeys, body.key],
      }));
      await onSaved();
      setMessage("Imagen añadida. Ahora puedes usarla en una sección.");
      return body.key as string;
    } catch (error) {
      setMessage((error as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function replaceImage(sectionId: string, imageId: string, file: File) {
    const key = await upload(file);
    if (!key) return;
    setDraft((current) => ({
      ...current,
      sections: current.sections?.map((s) =>
        s.id !== sectionId || !s.canvas
          ? s
          : {
              ...s,
              canvas: {
                ...s.canvas,
                elements: s.canvas.elements.map((item) =>
                  item.id !== imageId
                    ? item
                    : item.binding === "dress_code"
                      ? { ...item, dressPhotoKey: key }
                      : item.type === "image"
                        ? { ...item, photoKey: key }
                        : item,
                ),
              },
            },
      ),
    }));
    setMessage("Foto reemplazada. Guarda el diseño para aplicar el cambio.");
  }
  return {
    ...history,
    recovery,
    busy,
    message,
    sections,
    updateSection,
    moveSection,
    removeSection,
    addSection,
    addGuestSection,
    save,
    upload,
    replaceImage,
  };
}
