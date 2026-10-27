export const initialCanvasTool = "elements";
export const canvasToolGroups = [
  {
    label: "Crear",
    tools: [
      {
        id: "elements",
        icon: "sparkle",
        label: "Elementos",
        description: "Añade textos, fotos y elementos de tu invitación",
      },
      {
        id: "photos",
        icon: "image",
        label: "Imágenes",
        description: "Sube fotos y añádelas al diseño",
      },
      {
        id: "templates",
        icon: "layout",
        label: "Plantillas",
        description: "Empieza con una invitación completa y editable",
      },
    ],
  },
  {
    label: "Organizar",
    tools: [
      {
        id: "pages",
        icon: "lucide:panels-top-left",
        label: "Secciones",
        description: "Crea y organiza las partes de tu invitación",
      },
      {
        id: "background",
        icon: "lucide:wallpaper",
        label: "Fondos",
        description:
          "Elige color o imagen para una sección o toda la invitación",
      },
      {
        id: "layers",
        icon: "lucide:layers",
        label: "Capas",
        description: "Selecciona, reordena y edita los objetos de la sección",
      },
    ],
  },
  {
    label: "Experiencia",
    tools: [
      {
        id: "opening",
        icon: "mail",
        label: "Apertura",
        description: "Personaliza el sobre que reciben tus invitados",
      },
      {
        id: "music",
        icon: "music",
        label: "Música",
        description: "Elige la canción que acompaña la invitación",
      },
    ],
  },
] as const;
