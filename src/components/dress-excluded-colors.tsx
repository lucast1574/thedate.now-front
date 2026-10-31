import type { FlyerElement } from "@/lib/events/flyer";
export default function DressExcludedColors({
  colors,
  presentation,
}: {
  presentation?: FlyerElement["dressPaletteStyle"];
  colors: FlyerElement["dressExcludedColors"];
}) {
  if (!colors?.length) return null;
  return (
    <span
      className="dress-excluded-colors"
      data-palette={presentation || "auto"}
    >
      <strong>Preferimos evitar estos tonos</strong>
      <span>
        {colors.map((rule, index) => (
          <span className="dress-excluded-color" key={index}>
            <span
              className="dress-excluded-swatch"
              style={{ background: rule.color }}
              aria-hidden="true"
            />
            <span>{rule.name}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
