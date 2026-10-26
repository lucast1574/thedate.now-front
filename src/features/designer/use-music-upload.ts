import { useState } from "react";
import type { useInvitationDesign } from "./use-invitation-design";
export function useMusicUpload(editor: ReturnType<typeof useInvitationDesign>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file: File) {
    if (busy) return;
    setError("");
    if (!/\.mp3$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
      setError("Elige un archivo MP3 de hasta 10 MB.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`/api/audio/${editor.draft.id}`, {
        method: "POST",
        headers: { "Content-Type": "audio/mpeg" },
        body: file,
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error || "No se pudo subir la canción.");
      editor.setDraft((current) => ({
        ...current,
        audioKeys: [...(current.audioKeys || []), body.key],
        music: {
          source: "mp3",
          value: body.key,
          title: file.name.replace(/\.mp3$/i, "").slice(0, 160),
        },
      }));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return { upload, busy, error };
}
