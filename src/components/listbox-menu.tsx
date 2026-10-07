import { createPortal } from "react-dom";
import type { CSSProperties, RefObject } from "react";
import type { Choice } from "@/lib/ui/listbox";
import Icon from "./icon";
export default function ListboxMenu({
  menuRef,
  id,
  popup,
  options,
  active,
  selected,
  onActive,
  onChoose,
}: {
  menuRef: RefObject<HTMLDivElement | null>;
  id: string;
  popup: {
    position: CSSProperties;
    title: string;
    general: boolean;
    container: Element;
  };
  options: Choice[];
  active: number;
  selected: number;
  onActive: (index: number) => void;
  onChoose: (index: number) => void;
}) {
  return createPortal(
    <div
      ref={menuRef}
      id={id}
      role="listbox"
      aria-label={popup.title}
      className={`listbox-menu ${popup.general ? "listbox-general" : ""}`}
      style={popup.position}
      onPointerDown={(event) => event.preventDefault()}
    >
      {options.map((option, index) => (
        <div
          key={option.value}
          id={`${id}-${index}`}
          role="option"
          aria-selected={index === selected}
          aria-disabled={option.disabled || undefined}
          className={
            index === active ? "listbox-option active" : "listbox-option"
          }
          onPointerMove={() => {
            if (!option.disabled) onActive(index);
          }}
          onClick={() => onChoose(index)}
        >
          <span>{option.label}</span>
          {index === selected && <Icon name="check" />}
        </div>
      ))}
    </div>,
    popup.container,
  );
}
