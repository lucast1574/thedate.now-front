import { useTranslator } from "@/lib/i18n/react";
import Listbox from "@/components/listbox";
import {
  invitationTypefaces,
  typefacePatch,
} from "@/lib/events/invitation-type";
import type { FlyerElement } from "@/lib/events/flyer";
export default function TypefacePicker({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  return (
    <Listbox
      aria-label={i18n("Fuente del texto")}
      value={item.typeface || item.font}
      onValueChange={(value) => onChange(typefacePatch(value, i18n))}
    >
      {invitationTypefaces(i18n).map((face) => (
        <option key={face.value} value={face.value}>
          {face.label}
        </option>
      ))}
    </Listbox>
  );
}
