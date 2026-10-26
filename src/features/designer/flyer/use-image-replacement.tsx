import { useRef, useState } from "react";
export function useImageReplacement(
  replace?: (file: File, id: string) => Promise<void>,
) {
  const input = useRef<HTMLInputElement>(null);
  const target = useRef("");
  const [busy, setBusy] = useState(false);
  return {
    request: (id: string) => {
      if (!replace || busy) return;
      target.current = id;
      input.current?.click();
    },
    input: replace ? (
      <input
        ref={input}
        className="canvas-replace-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Reemplazar foto del diseño"
        disabled={busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          const id = target.current;
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try {
            await replace(file, id);
          } finally {
            setBusy(false);
          }
        }}
      />
    ) : null,
  };
}
