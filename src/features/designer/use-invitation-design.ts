"use client";
import { useState } from "react";
import { useDesignHistory } from "./use-design-history";
import { useDesignRecovery } from "./use-design-recovery";
import { persistDesign } from "./persist-design";
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
  const [savedVersion, setSavedVersion] = useState(0);
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
  async function commit(publishChanges: boolean) {
    setBusy(true);
    setMessage("");
    try {
      const version = await persistDesign(
        draft,
        Math.max(event.designVersion || 0, savedVersion),
      );
      setSavedVersion(version || 0);
      await onSaved();
      if (publishChanges) {
        await api(`/api/backend/events/${draft.id}/design/publish`, "POST", {
          expectedVersion: version,
        });
        await onSaved();
      }
      setMessage(
        publishChanges
          ? "Cambios publicados. Tus invitados los verán en el mismo enlace."
          : draft.publishedAt
            ? "Borrador guardado. Tus invitados siguen viendo la versión publicada."
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
  const save = () => commit(false);
  const publish = () => commit(true);
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
    publish,
    unpublishedChanges: Boolean(
      event.publishedAt &&
      (event.designVersion || 0) !== (event.publishedDesignVersion || 0),
    ),
    upload,
    replaceImage,
  };
}
