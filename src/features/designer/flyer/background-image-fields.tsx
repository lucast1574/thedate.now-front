import Listbox from "@/components/listbox";
import type { ImageBackground } from "@/lib/events/background";
export default function BackgroundImageFields({
  value,
  onChange,
}: {
  value: ImageBackground;
  onChange: (patch: Partial<ImageBackground>) => void;
}) {
  return (
    <>
      <label>
        Ajuste de imagen
        <Listbox
          value={value.fit}
          aria-label="Ajuste de imagen de fondo"
          onValueChange={(fit) =>
            onChange({ fit: fit as ImageBackground["fit"] })
          }
        >
          <option value="cover">Cubrir el fondo</option>
          <option value="contain">Mostrar imagen completa</option>
        </Listbox>
      </label>
      <label>
        Posición
        <Listbox
          value={value.position}
          aria-label="Posición de imagen de fondo"
          onValueChange={(position) =>
            onChange({ position: position as ImageBackground["position"] })
          }
        >
          <option value="top">Arriba</option>
          <option value="center">Centro</option>
          <option value="bottom">Abajo</option>
        </Listbox>
      </label>
      <label>
        Intensidad de imagen · {Math.round(value.opacity * 100)} %
        <input
          aria-label="Intensidad de imagen de fondo"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value.opacity}
          onChange={(e) => onChange({ opacity: Number(e.target.value) })}
        />
      </label>
    </>
  );
}
