"use client";
import { useSilentDesign } from "./use-silent-design";
import { useState } from "react";
import { useDesignHistory } from "./use-design-history";
import { guestNameElement } from "@/lib/events/guest-name";
import { blankCanvas } from "./flyer/canvas-model";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
export function useInvitationDesign(
  event: DesignEvent,
  onSaved: () => Promise<void>,
  initialDraft?: DesignEvent,
) {
  const history = useDesignHistory(event, initialDraft);
  const { draft, setDraft } = history;
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
  const persistence = useSilentDesign(draft, event, setMessage);
  async function save() {
    return persistence.save();
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
  }
  return {
    ...history,
    publish: async () => {
      setBusy(true);
      try {
        if (await persistence.publish()) await onSaved();
      } finally {
        setBusy(false);
      }
    },
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
