import { useEffect, type RefObject } from "react";
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
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    window.addEventListener("resize", close);
    document.addEventListener("scroll", outside, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      window.removeEventListener("resize", close);
      document.removeEventListener("scroll", outside, true);
    };
  }, [open, button, menu, close]);
}
