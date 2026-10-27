import { useEffect, type PointerEvent, type RefObject } from "react";
export function useListboxDismiss(
  open: boolean,
  button: RefObject<HTMLButtonElement | null>,
  menu: RefObject<HTMLDivElement | null>,
  close: () => void,
) {
  useEffect(() => {
    if (!open) return;
    function outside(event: Event) {
      if (
        !menu.current?.contains(event.target as Node) &&
        !button.current?.contains(event.target as Node)
      )
        close();
    }
    const anchor = button.current?.getBoundingClientRect();
    function scroll(event: Event) {
      if (menu.current?.contains(event.target as Node)) return;
      const rect = button.current?.getBoundingClientRect();
      if (
        anchor &&
        rect &&
        (Math.abs(rect.top - anchor.top) > 1 ||
          Math.abs(rect.left - anchor.left) > 1)
      )
        close();
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    window.addEventListener("resize", close);
    document.addEventListener("scroll", scroll, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      window.removeEventListener("resize", close);
      document.removeEventListener("scroll", scroll, true);
    };
  }, [open, button, menu, close]);
}

export function focusListbox(event: PointerEvent<HTMLButtonElement>) {
  if (event.button !== 0) return;
  event.preventDefault();
  event.currentTarget.focus({ preventScroll: true });
}
