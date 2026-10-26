import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
export default function TextStyleFields({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  return (
    <>
      <label>
        Tipografía
        <Listbox
          value={item.font}
          onValueChange={(font) =>
            onChange({ font: font as FlyerElement["font"] })
          }
        >
          <option value="serif">Elegante · Serif</option>
          <option value="sans">Moderna · Sans</option>
          <option value="script">Manuscrita</option>
          <option value="mono">Monoespaciada</option>
        </Listbox>
      </label>
      <label>
        Tamaño del texto
        <input
          type="number"
          min={8}
          max={160}
          value={item.fontSize}
          onChange={(e) =>
            onChange({
              fontSize: Math.max(8, Math.min(160, Number(e.target.value))),
            })
          }
        />
      </label>
      <div className="editor-button-row">
        <button
          aria-pressed={item.bold}
          onClick={() => onChange({ bold: !item.bold })}
        >
          Negrita
        </button>
        <Listbox
          aria-label="Alineación del texto"
          value={item.align}
          onValueChange={(align) =>
            onChange({ align: align as FlyerElement["align"] })
          }
        >
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </Listbox>
      </div>
    </>
  );
}
