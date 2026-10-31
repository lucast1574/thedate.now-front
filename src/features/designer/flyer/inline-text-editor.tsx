import { useEffect, useRef, useState } from "react";
import type { FlyerElement } from "@/lib/events/flyer";
import type { DesignEvent } from "@/lib/events/types";
import { directTextChange, directTextMode } from "./direct-text";

export default function InlineTextEditor({
  item,
  event = {},
  onCommit,
  onCancel,
}: {
  item: FlyerElement;
  event?: Partial<DesignEvent>;
  onCommit: (change: ReturnType<typeof directTextChange>) => void;
  onCancel: () => void;
}) {
  const mode = directTextMode(item);
  const [text, setText] = useState(
    mode === "names"
      ? event.celebration?.partnerOne || ""
      : mode === "title"
        ? event.title || ""
        : item.text || "",
  );
  const [second, setSecond] = useState(event.celebration?.partnerTwo || "");
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  function complete(cancel = false) {
    if (finished.current) return;
    if (cancel) {
      finished.current = true;
      onCancel();
      return;
    }
    try {
      const change = directTextChange(item, event, text, second);
      finished.current = true;
      onCommit(change);
    } catch (err) {
      setError((err as Error).message);
    }
  }
  useEffect(() => {
    const input = root.current?.querySelector<
      HTMLTextAreaElement | HTMLInputElement
    >("textarea,input");
    input?.focus({ preventScroll: true });
    input?.select();
  }, []);
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) complete();
    };
    document.addEventListener("pointerdown", outside, true);
    return () => document.removeEventListener("pointerdown", outside, true);
  });
  return (
    <div
      ref={root}
      className={`canvas-inline-edit ${mode === "names" ? "is-names" : ""}`}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.nativeEvent.isComposing) return;
        if ((e.target as HTMLElement).closest("button")) return;
        if (e.key === "Escape") {
          e.preventDefault();
          complete(true);
          e.currentTarget.parentElement?.focus({ preventScroll: true });
        }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey || mode === "names")) {
          e.preventDefault();
          complete();
          if (finished.current)
            e.currentTarget.parentElement?.focus({ preventScroll: true });
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          complete();
      }}
    >
      {mode === "names" ? (
        <>
          <label>
            Primer nombre
            <input
              maxLength={120}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <label>
            Segundo nombre
            <input
              maxLength={120}
              value={second}
              onChange={(e) => setSecond(e.target.value)}
            />
          </label>
        </>
      ) : (
        <textarea
          aria-label={
            mode === "title"
              ? "Nombre del evento en el lienzo"
              : "Editar texto en el lienzo"
          }
          maxLength={mode === "title" ? 160 : 2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}
      <div className="canvas-inline-actions">
        {error ? (
          <small role="alert">{error}</small>
        ) : (
          <small>
            {mode === "names"
              ? "Se actualizan todos los nombres vinculados"
              : "Ctrl + Enter para aplicar · Esc para cancelar"}
          </small>
        )}
        <button type="button" onClick={() => complete(true)}>
          Cancelar
        </button>
        <button type="button" onClick={() => complete()}>
          Aplicar
        </button>
      </div>
    </div>
  );
}
