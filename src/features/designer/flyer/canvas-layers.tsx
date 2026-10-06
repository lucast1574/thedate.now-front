import type { FlyerElement } from "@/lib/events/flyer";
export default function CanvasLayers({
  elements,
  selectedId,
  onSelect,
}: {
  elements: FlyerElement[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {[...elements].reverse().map((item) => (
        <button
          type="button"
          key={item.id}
          aria-pressed={item.id === selectedId}
          onClick={() => onSelect(item.id)}
        >
          {item.type === "text"
            ? item.text?.slice(0, 30) || "Texto"
            : item.type === "image"
              ? "Imagen"
              : "Icono"}
        </button>
      ))}
    </>
  );
}
