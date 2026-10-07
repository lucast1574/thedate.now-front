"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import ListboxMenu from "./listbox-menu";
import { useListboxDismiss } from "./use-listbox-dismiss";
import {
  findChoice,
  listboxPosition,
  moveChoice,
  optionChoices,
} from "@/lib/ui/listbox";
import Icon from "./icon";
type Props = {
  children: ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
};
export default function Listbox({
  children,
  value = "",
  onValueChange,
  disabled,
  required,
  id,
  name,
  "aria-label": label,
}: Props) {
  const uid = useId(),
    listId = `${uid}-options`;
  const button = useRef<HTMLButtonElement>(null),
    menu = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", at: 0 });
  const [popup, setPopup] = useState<{
    position: ReturnType<typeof listboxPosition>;
    title: string;
    general: boolean;
    container: Element;
  } | null>(null);
  const [active, setActive] = useState(-1);
  const options = optionChoices(children);
  const selected = options.findIndex((option) => option.value === value);
  function open(index = selected) {
    if (disabled || !options.some((option) => !option.disabled)) return;
    const rect = button.current!.getBoundingClientRect();
    setPopup({
      position: listboxPosition(rect, window.innerWidth, window.innerHeight),
      title:
        label ||
        button.current?.labels?.[0]?.childNodes[0]?.textContent?.trim() ||
        "Opciones",
      general: !!button.current?.closest(
        ".office-general, .editor-general, .manager-general",
      ),
      container: button.current?.closest("dialog") || document.body,
    });
    setActive(
      index >= 0 && !options[index]?.disabled
        ? index
        : moveChoice(options, -1, 1),
    );
  }
  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    if (option.value !== value) onValueChange(option.value);
    setPopup(null);
    button.current?.focus();
  }
  useListboxDismiss(!!popup, button, menu, () => setPopup(null));
  useEffect(() => {
    if (popup)
      menu.current
        ?.querySelector(`[id="${listId}-${active}"]`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, popup, listId]);
  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const key = event.key;
    if (key === "Tab" || key === "Escape") {
      search.current.text = "";
      setPopup(null);
      return;
    }
    if (
      key === "Enter" ||
      (key === " " && Date.now() - search.current.at > 600)
    ) {
      event.preventDefault();
      if (popup) choose(active);
      else open();
      return;
    }
    let next = active;
    if (key === "ArrowDown" || key === "ArrowUp")
      next = moveChoice(
        options,
        popup ? active : selected,
        key === "ArrowDown" ? 1 : -1,
      );
    else if (key === "Home") next = moveChoice(options, -1, 1);
    else if (key === "End") next = moveChoice(options, 0, -1);
    else if (
      key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const now = Date.now();
      search.current.text =
        now - search.current.at > 600 ? key : search.current.text + key;
      search.current.at = now;
      next = findChoice(
        options,
        search.current.text,
        popup ? active : selected,
      );
    } else return;
    event.preventDefault();
    if (popup) setActive(next);
    else open(next);
  }
  return (
    <>
      <button
        type="button"
        id={id}
        ref={button}
        className="custom-listbox"
        role="combobox"
        aria-label={label}
        aria-expanded={!!popup}
        aria-haspopup="listbox"
        aria-controls={popup ? listId : undefined}
        aria-activedescendant={
          popup && active >= 0 ? `${listId}-${active}` : undefined
        }
        aria-required={required}
        disabled={disabled}
        onClick={() => {
          search.current.text = "";
          if (popup) setPopup(null);
          else open();
        }}
        onKeyDown={keyDown}
      >
        <span>{options[selected]?.label || "Seleccionar…"}</span>
        <Icon name="chevron" />
      </button>
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
      {required && (
        <input
          className="listbox-validation"
          aria-hidden="true"
          tabIndex={-1}
          value={value}
          required
          disabled={disabled}
          onChange={() => {}}
          onInvalid={(event) => {
            event.preventDefault();
            button.current?.focus();
            open();
          }}
        />
      )}
      {popup && !disabled && (
        <ListboxMenu
          menuRef={menu}
          id={listId}
          popup={popup}
          options={options}
          active={active}
          selected={selected}
          onActive={setActive}
          onChoose={choose}
        />
      )}
    </>
  );
}
