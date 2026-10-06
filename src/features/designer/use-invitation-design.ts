"use client";
import { useState } from "react";
import { useDesignHistory } from "./use-design-history";
import { designPayload } from "./design-state";
import { blankCanvas } from "./flyer/canvas-model";
import { api } from "@/lib/api/client";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
export function useInvitationDesign(
  event: DesignEvent,
  onSaved: () => Promise<void>,
) {
  const history = useDesignHistory(event);
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
            ? { canvas: blankCanvas(current.accentColor) }
            : {}),
        },
      ],
    }));
  }
  async function save() {
    setBusy(true);
    setMessage("");
    try {
      await api(
        `/api/backend/events/${draft.id}/design`,
        "PATCH",
        designPayload(draft),
      );
      await onSaved();
      setMessage("Diseño guardado.");
    } catch (error) {
      setMessage((error as Error).message);
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
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return {
    ...history,
    busy,
    message,
    sections,
    updateSection,
    moveSection,
    removeSection,
    addSection,
    save,
    upload,
  };
}
