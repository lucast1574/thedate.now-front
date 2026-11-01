import { useLayoutEffect, useState, type RefObject } from "react";

export function useVenueCanvasSize(ref: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState<{ width: number; height: number }>();
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      if (width > 0 && height > 0)
        setSize((current) =>
          current?.width === width && current.height === height
            ? current
            : { width, height },
        );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [ref]);
  return size;
}
