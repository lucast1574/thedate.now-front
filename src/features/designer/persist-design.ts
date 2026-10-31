import { validDesignDressColors } from "@/lib/events/dress-code";
import { validMapLink } from "@/lib/events/location-element";
import { api } from "@/lib/api/client";
import type { DesignEvent } from "@/lib/events/types";
import { designPayload } from "./design-state";

export async function persistDesign(
  draft: DesignEvent,
  expectedVersion: number,
) {
  const sections = draft.sections || [];
  if (!validDesignDressColors(sections))
    throw new Error(
      "Revisa los colores no permitidos del dress code: cada muestra necesita un nombre y un color válido (máximo 8).",
    );
  if (
    sections.some((section) =>
      section.canvas?.elements.some(
        (item) =>
          item.binding === "location" &&
          !item.eventBound &&
          item.link &&
          !validMapLink(item.link),
      ),
    )
  )
    throw new Error(
      "Revisa el enlace de Google Maps en la ubicación antes de guardar.",
    );
  const result = await api<{ designVersion: number }>(
    `/api/backend/events/${draft.id}/design`,
    "PATCH",
    { ...designPayload(draft), expectedVersion },
  );
  if (!Number.isSafeInteger(result.designVersion))
    throw new Error(
      "El borrador se guardó. Vuelve a abrir el editor para cargar la versión actual.",
    );
  return result.designVersion;
}
