import type { Kind } from "@/lib/events/types";
import type { DesignMode } from "@/lib/events/flyer";
export type InvitationTemplate = {
  id: string;
  name: string;
  kind: Kind;
  mode: DesignMode;
  accent: string;
  background: string;
  font: "serif" | "sans";
  style: "classic" | "modern";
  tagline: string;
};
import { weddingTemplates } from "./wedding-templates";
import { generalTemplates } from "./general-templates";
export const invitationTemplates = [...weddingTemplates, ...generalTemplates];
export function resolveTemplateId(
  kind: Kind,
  style: string,
  mode: DesignMode = "sections",
  id?: string,
) {
  return (
    invitationTemplates.find(
      (t) =>
        t.id === id && t.kind === kind && t.style === style && t.mode === mode,
    )?.id ||
    invitationTemplates.find(
      (t) => t.kind === kind && t.style === style && t.mode === mode,
    )!.id
  );
}
