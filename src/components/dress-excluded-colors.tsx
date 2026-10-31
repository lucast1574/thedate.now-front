import type { FlyerElement } from "@/lib/events/flyer";
export default function DressExcludedColors({
  colors,
}: {
  colors: FlyerElement["dressExcludedColors"];
}) {
  if (!colors?.length) return null;
  return (
    <span className="dress-excluded-colors">
      <strong>Evita estos colores</strong>
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
