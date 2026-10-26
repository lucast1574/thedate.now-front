import { useEffect, useRef, type RefObject } from "react";
export function useTemplateNavigation(
  panel: RefObject<HTMLDivElement | null>,
  selectedId: string,
) {
  const previous = useRef("");
  useEffect(() => {
    const root = panel.current;
    root?.parentElement?.scrollTo({ top: 0 });
    const target = selectedId
      ? root?.querySelector<HTMLButtonElement>(".template-back")
      : previous.current
        ? root?.querySelector<HTMLButtonElement>(
            `[data-template-id="${previous.current}"]`,
          )
        : null;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "nearest" });
    if (selectedId) previous.current = selectedId;
  }, [panel, selectedId]);
}
