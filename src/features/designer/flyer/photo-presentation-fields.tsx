import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
export default function PhotoPresentationFields({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  return (
    <>
      <label>
        Acabado de la foto
        <Listbox
          aria-label="Acabado de la foto"
          value={item.photoTreatment || "none"}
          onValueChange={(value) =>
            onChange({
              photoTreatment: value as FlyerElement["photoTreatment"],
            })
          }
        >
          <option value="none">Bordes definidos</option>
          <option value="soft">Bordes suaves y difuminados</option>
          <option value="fade">Fundido con el papel</option>
          <option value="arch">Arco</option>
          <option value="cinema">Portada cinematográfica</option>
        </Listbox>
      </label>
      <label>
        Encuadre
        <Listbox
          aria-label="Encuadre de la foto"
          value={item.photoFit || "contain"}
          onValueChange={(value) =>
            onChange({ photoFit: value as FlyerElement["photoFit"] })
          }
        >
          <option value="contain">Ver foto completa</option>
          <option value="cover">Llenar el espacio</option>
        </Listbox>
      </label>
    </>
  );
}
