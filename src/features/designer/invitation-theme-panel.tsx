import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import type { useInvitationDesign } from "./use-invitation-design";
import { invitationTheme, updateInvitationTheme } from "./invitation-theme";
import type { FlyerElement, FlyerCanvas } from "@/lib/events/flyer";
export default function InvitationThemePanel({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const theme = invitationTheme(editor.draft);
  const set = (next: Parameters<typeof updateInvitationTheme>[1]) =>
    editor.setDraft((current) => updateInvitationTheme(current, next));
  return (
    <details className="invitation-theme-panel">
      <summary>Estilo de toda la invitación</summary>
      <p>
        Cambia el conjunto. Los colores y las fuentes que hayas personalizado se
        conservan.
      </p>
      <label>
        Color del diseño
        <ColorPicker value={theme.ink} onChange={(ink) => set({ ink })} />
      </label>
      <label>
        Color del papel
        <ColorPicker
          value={theme.background}
          onChange={(background) => set({ background })}
        />
      </label>
      <label>
        Tipografía
        <Listbox
          aria-label="Tipografía de toda la invitación"
          value={theme.font}
          onValueChange={(font) => set({ font: font as FlyerElement["font"] })}
        >
          <option value="serif">Editorial</option>
          <option value="sans">Contemporánea</option>
          <option value="script">Caligráfica</option>
          <option value="mono">Máquina de escribir</option>
        </Listbox>
      </label>
      <label>
        Ornamentación
        <Listbox
          aria-label="Ornamentación de la invitación"
          value={editor.sections[0]?.canvas?.art || ""}
          onValueChange={(art) =>
            editor.setDraft((current) => ({
              ...current,
              sections: current.sections?.map((s) => ({
                ...s,
                canvas: s.canvas
                  ? {
                      ...s.canvas,
                      art: (art || undefined) as FlyerCanvas["art"],
                    }
                  : undefined,
              })),
            }))
          }
        >
          <option value="">Sin ornamentos</option>
          <option value="botanical">Jardín botánico</option>
          <option value="romance">Arco romántico</option>
          <option value="gala">Noche de gala</option>
          <option value="editorial">Editorial</option>
          <option value="fiesta">Celebración</option>
          <option value="coastal">Brisa del mar</option>
        </Listbox>
      </label>
    </details>
  );
}
