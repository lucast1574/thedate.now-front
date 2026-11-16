import { useTranslator } from "@/lib/i18n/react";
import Listbox from "@/components/listbox";
import type { ImageBackground } from "@/lib/events/background";
export default function BackgroundImageFields({
  value,
  onChange,
}: {
  value: ImageBackground;
  onChange: (patch: Partial<ImageBackground>) => void;
}) {
  const i18n = useTranslator();

  return (
    <>
      <label>
        {i18n("Ajuste de imagen")}{" "}
        <Listbox
          value={value.fit}
          aria-label={i18n("Ajuste de imagen de fondo")}
          onValueChange={(fit) =>
            onChange({ fit: fit as ImageBackground["fit"] })
          }
        >
          <option value="cover">{i18n("Cubrir el fondo")}</option>
          <option value="contain">{i18n("Mostrar imagen completa")}</option>
        </Listbox>
      </label>
      <label>
        {i18n("Posición")}{" "}
        <Listbox
          value={value.position}
          aria-label={i18n("Posición de imagen de fondo")}
          onValueChange={(position) =>
            onChange({ position: position as ImageBackground["position"] })
          }
        >
          <option value="top">{i18n("Arriba")}</option>
          <option value="center">{i18n("Centro")}</option>
          <option value="bottom">{i18n("Abajo")}</option>
        </Listbox>
      </label>
      <label>
        {i18n("Intensidad de imagen ·")} {Math.round(value.opacity * 100)} %
        <input
          aria-label={i18n("Intensidad de imagen de fondo")}
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
