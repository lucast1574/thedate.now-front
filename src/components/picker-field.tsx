"use client";
import { createPortal } from "react-dom";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import Icon from "./icon";
import { pickerPosition } from "@/lib/ui/date-time";
const PickerClose = createContext<() => void>(() => {});
export function usePickerClose() {
  return useContext(PickerClose);
}
export default function PickerField({
  label,
  value,
  display,
  icon,
  required,
  children,
}: {
  label: string;
  value: string;
  display: string;
  icon: string;
  required?: boolean;
  children: ReactNode;
}) {
  const id = useId(),
    button = useRef<HTMLButtonElement>(null),
    panel = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<{
    position: CSSProperties;
    general: boolean;
    container: Element;
  } | null>(null);
  const close = useCallback(() => {
    setPopup(null);
    button.current?.focus();
  }, []);
  function open() {
    const node = button.current!;
    setPopup({
      position: pickerPosition(
        node.getBoundingClientRect(),
        innerWidth,
        innerHeight,
      ),
      general: !!node.closest(
        ".office-general,.editor-general,.manager-general",
      ),
      container: node.closest("dialog") || document.body,
    });
  }
  useEffect(() => {
    if (!popup) return;
    function outside(e: Event) {
      const node = e.target as Node;
      if (!button.current?.contains(node) && !panel.current?.contains(node))
        setPopup(null);
    }
    function dismiss() {
      setPopup(null);
    }
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", dismiss);
    };
  }, [popup]);
  return (
    <div className="date-time-field">
      <span className="date-time-label">{label}</span>
      <button
        ref={button}
        type="button"
        className="date-time-trigger"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={!!popup}
        aria-controls={popup ? id : undefined}
        onClick={() => (popup ? close() : open())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            open();
          }
          if (e.key === "Escape") close();
        }}
      >
        <span className={!value ? "picker-placeholder" : ""}>{display}</span>
        <Icon name={icon} />
      </button>
      {required && (
        <input
          className="picker-validation"
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => {}}
          onInvalid={(e) => {
            e.preventDefault();
            open();
            button.current?.focus();
          }}
        />
      )}
      {popup &&
        createPortal(
          <div
            ref={panel}
            id={id}
            className={`date-time-popover ${popup.general ? "picker-general" : "picker-wedding"}`}
            role="dialog"
            aria-label={label}
            style={popup.position}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                close();
              }
            }}
          >
            <div className="date-time-popover-heading">
              <strong>{label}</strong>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar selector"
              >
                ×
              </button>
            </div>
            <PickerClose.Provider value={close}>
              {children}
            </PickerClose.Provider>
          </div>,
          popup.container,
        )}
    </div>
  );
}
