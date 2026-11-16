import { useTranslator } from "@/lib/i18n/react";
import PhotoFocalFields from "./photo-focal-fields";
import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
export default function PhotoPresentationFields({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  return (
    <>
      <label>
        {i18n("Acabado de la foto")}{" "}
        <Listbox
          aria-label={i18n("Acabado de la foto")}
          value={item.photoTreatment || "none"}
          onValueChange={(value) =>
            onChange({
              photoTreatment: value as FlyerElement["photoTreatment"],
            })
          }
        >
          <option value="none">{i18n("Bordes definidos")}</option>
          <option value="soft">{i18n("Bordes suaves y difuminados")}</option>
          <option value="fade">{i18n("Fundido con el papel")}</option>
          <option value="arch">{i18n("Arco")}</option>
          <option value="cinema">{i18n("Portada cinematográfica")}</option>
        </Listbox>
      </label>
      <label>
        {i18n("Encuadre")}{" "}
        <Listbox
          aria-label={i18n("Encuadre de la foto")}
          value={item.photoFit || "contain"}
          onValueChange={(value) =>
            onChange({ photoFit: value as FlyerElement["photoFit"] })
          }
        >
          <option value="contain">{i18n("Ver foto completa")}</option>
          <option value="cover">{i18n("Llenar el espacio")}</option>
        </Listbox>
      </label>
      <PhotoFocalFields item={item} onChange={onChange} />
    </>
  );
}
