"use client";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import Icon from "./icon";
import ColorPanel from "./color-panel";
import { normalizeColor } from "@/lib/ui/color";
export default function ColorPicker({
  value = "#AD7254",
  onChange,
  label = "Color",
}: {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false),
    id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<{
    container: Element;
    theme: string;
    position: CSSProperties;
  } | null>(null);
  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);
  function show() {
    const node = trigger.current!;
    const rect = node.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    setPopup({
      container: node.closest("dialog") || document.body,
      theme: node.closest(".office-general,.editor-general,.manager-general")
        ? "office-general"
        : "office-wedding",
      position: {
        top: Math.max(
          12,
          Math.min(
            rect.bottom + 8,
            innerHeight - Math.min(680, innerHeight - 24) - 12,
          ),
        ),
        maxHeight: Math.min(680, innerHeight - 24),
        width: Math.min(360, viewportWidth - 24),
        left: Math.max(
          12,
          Math.min(
            rect.left,
            viewportWidth - Math.min(360, viewportWidth - 24) - 12,
          ),
        ),
      },
    });
    setOpen(true);
  }
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    function outside(e: Event) {
      if (
        !panel.current?.contains(e.target as Node) &&
        !trigger.current?.contains(e.target as Node)
      )
        setOpen(false);
    }
    function scroll(e: Event) {
      if (!panel.current?.contains(e.target as Node)) setOpen(false);
    }
    function dismiss() {
      setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", scroll, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", scroll, true);
    };
  }, [open]);
  const color = normalizeColor(value) || "#AD7254";
  return (
    <div className="color-picker">
      <button
        ref={trigger}
        type="button"
        className="color-trigger"
        aria-label={`Elegir ${label.toLowerCase()}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            show();
          }
          if (e.key === "Escape") close();
        }}
      >
        <span
          className="color-trigger-swatch"
          style={{ backgroundColor: color }}
        />
        <span>
          <strong>{color}</strong>
          <small>Personalizar color</small>
        </span>
        <Icon name="chevron" />
      </button>
      {open &&
        popup &&
        createPortal(
          <div
            ref={panel}
            className={`color-picker color-popout ${popup.theme}`}
            style={popup.position}
            role="dialog"
            aria-label={label}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                close();
              }
            }}
            onBlurCapture={(e) => {
              if (
                e.relatedTarget &&
                !e.currentTarget.contains(e.relatedTarget as Node) &&
                e.relatedTarget !== trigger.current
              )
                setOpen(false);
            }}
          >
            <ColorPanel
              id={id}
              value={color}
              onChange={onChange}
              onClose={close}
            />
          </div>,
          popup.container,
        )}
    </div>
  );
}
