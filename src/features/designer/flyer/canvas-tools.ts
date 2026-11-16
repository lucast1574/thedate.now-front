import { type Translator, localized } from "@/lib/i18n/translator";
export const initialCanvasTool = "elements";
export const canvasToolGroups = localized(
  (i18n: Translator) =>
    [
      {
        label: i18n("Crear"),
        tools: [
          {
            id: "elements",
            icon: "sparkle",
            label: i18n("Elementos"),
            description: i18n(
              "Añade textos, fotos y elementos de tu invitación",
            ),
          },
          {
            id: "photos",
            icon: "image",
            label: i18n("Imágenes"),
            description: i18n("Sube fotos y añádelas al diseño"),
          },
          {
            id: "templates",
            icon: "layout",
            label: i18n("Plantillas"),
            description: i18n("Empieza con una invitación completa y editable"),
          },
        ],
      },
      {
        label: i18n("Organizar"),
        tools: [
          {
            id: "pages",
            icon: "lucide:panels-top-left",
            label: i18n("Secciones"),
            description: i18n("Crea y organiza las partes de tu invitación"),
          },
          {
            id: "background",
            icon: "lucide:wallpaper",
            label: i18n("Fondos"),
            description: i18n(
              "Elige color o imagen para una sección o toda la invitación",
            ),
          },
          {
            id: "layers",
            icon: "lucide:layers",
            label: i18n("Capas"),
            description: i18n(
              "Selecciona, reordena y edita los objetos de la sección",
            ),
          },
        ],
      },
      {
        label: i18n("Experiencia"),
        tools: [
          {
            id: "opening",
            icon: "mail",
            label: i18n("Apertura"),
            description: i18n("Personaliza el sobre que reciben tus invitados"),
          },
          {
            id: "music",
            icon: "music",
            label: i18n("Música"),
            description: i18n("Elige la canción que acompaña la invitación"),
          },
        ],
      },
    ] as const,
);
