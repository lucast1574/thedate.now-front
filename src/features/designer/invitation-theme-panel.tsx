import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const theme = invitationTheme(editor.draft, i18n);
  const set = (next: Parameters<typeof updateInvitationTheme>[1]) =>
    editor.setDraft((current) => updateInvitationTheme(current, next, i18n));
  return (
    <details className="invitation-theme-panel">
      <summary>{i18n("Estilo de toda la invitación")}</summary>
      <p>
        {i18n(
          "Cambia el conjunto. Los colores y las fuentes que hayas personalizado se conservan.",
        )}
      </p>
      <label>
        {i18n("Color del diseño")}{" "}
        <ColorPicker value={theme.ink} onChange={(ink) => set({ ink })} />
      </label>
      <label>
        {i18n("Color del papel")}{" "}
        <ColorPicker
          value={theme.background}
          onChange={(background) => set({ background })}
        />
      </label>
      <label>
        {i18n("Tipografía")}{" "}
        <Listbox
          aria-label={i18n("Tipografía de toda la invitación")}
          value={theme.font}
          onValueChange={(font) => set({ font: font as FlyerElement["font"] })}
        >
          <option value="serif">{i18n("Editorial")}</option>
          <option value="sans">{i18n("Contemporánea")}</option>
          <option value="script">{i18n("Caligráfica")}</option>
          <option value="mono">{i18n("Máquina de escribir")}</option>
        </Listbox>
      </label>
      <label>
        {i18n("Ornamentación")}{" "}
        <Listbox
          aria-label={i18n("Ornamentación de la invitación")}
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
          <option value="">{i18n("Sin ornamentos")}</option>
          <option value="botanical">{i18n("Jardín botánico")}</option>
          <option value="romance">{i18n("Arco romántico")}</option>
          <option value="gala">{i18n("Noche de gala")}</option>
          <option value="editorial">{i18n("Editorial")}</option>
          <option value="fiesta">{i18n("Celebración")}</option>
          <option value="coastal">{i18n("Brisa del mar")}</option>
        </Listbox>
      </label>
    </details>
  );
}
