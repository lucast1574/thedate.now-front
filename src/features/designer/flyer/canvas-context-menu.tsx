import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/icon";
import type { CanvasCommand } from "./canvas-commands";
export type MenuPosition = {
  x: number;
  y: number;
  id: string;
  general: boolean;
};
const commands: [CanvasCommand, string, string][] = [
  ["duplicate", "Duplicar", "lucide:copy"],
  ["forward", "Traer adelante", "lucide:arrow-up"],
  ["front", "Traer al frente", "layout"],
  ["backward", "Enviar atrás", "down"],
  ["back", "Enviar al fondo", "lucide:layers"],
  ["center-x", "Centrar horizontalmente", "lucide:align-center-horizontal"],
  ["center-y", "Centrar verticalmente", "lucide:align-center-horizontal"],
  ["delete", "Eliminar", "lucide:trash-2"],
];
export default function CanvasContextMenu({
  position,
  onCommand,
  onClose,
}: {
  position: MenuPosition;
  onCommand: (command: CanvasCommand) => void;
  onClose: (restore?: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.focus({ preventScroll: true });
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const scroll = () => onClose();
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", scroll);
    window.addEventListener("scroll", scroll, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", scroll);
      window.removeEventListener("scroll", scroll, true);
    };
  }, [onClose]);
  return createPortal(
    <div
      ref={ref}
      className={`canvas-context-menu ${position.general ? "is-general" : ""}`}
      role="menu"
      onClick={(e) => e.stopPropagation()}
      aria-label="Opciones del elemento"
      style={{
        left: Math.max(8, Math.min(position.x, window.innerWidth - 248)),
        top: Math.max(8, Math.min(position.y, window.innerHeight - 360)),
      }}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        const buttons = Array.from(
            ref.current?.querySelectorAll("button") || [],
          ),
          index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (e.key === "Escape" || e.key === "Tab") {
          e.preventDefault();
          onClose(true);
        } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
          e.preventDefault();
          buttons[
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? buttons.length - 1
                : (index + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) %
                  buttons.length
          ]?.focus({ preventScroll: true });
        }
      }}
    >
      {commands.map(([command, label, icon]) => (
        <button
          key={command}
          role="menuitem"
          className={command === "delete" ? "is-destructive" : ""}
          onClick={() => onCommand(command)}
        >
          <Icon name={icon} />
          <span>{label}</span>
          {command === "delete" && <small>Supr</small>}
        </button>
      ))}
    </div>,
    document.body,
  );
}
