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
  return (
    <Listbox
      aria-label="Fuente del texto"
      value={item.typeface || item.font}
      onValueChange={(value) => onChange(typefacePatch(value))}
    >
      {invitationTypefaces.map((face) => (
        <option key={face.value} value={face.value}>
          {face.label}
        </option>
      ))}
    </Listbox>
  );
}
