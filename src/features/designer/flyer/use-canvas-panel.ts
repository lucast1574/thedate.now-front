import { useEffect, useRef } from "react";
export function useCanvasPanel(
  tool: string,
  selectedId: string,
  sectionId: string,
) {
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [tool, selectedId, sectionId]);
  return panel;
}
