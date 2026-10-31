import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templateIdentity } from "./template-identity";
import { templatePage, templateText } from "./template-pages";
import { element } from "./flyer/canvas-model";
export function templateStoryPage(t: InvitationTemplate) {
  const p = templateIdentity(t),
    w = t.kind === "wedding",
    inset = p.inset;
  const text = (
    id: string,
    value: string,
    x: number,
    y: number,
    width: number,
    height: number,
    size: number,
  ) =>
    templateText(t, id, value, y, height, size, { x, width, align: p.align });
  const photo = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    arch = false,
  ) =>
    element("image", {
      id,
      photoKey: "template-photo",
      x,
      y,
      width,
      height,
      photoTreatment: arch ? "arch" : "fade",
    });
  const guest = text(
    "guest",
    "Hola, {{nombre_invitado}}",
    inset,
    125,
    720 - 2 * inset,
    90,
    34,
  );
  guest.binding = "guest_name";
  const lead = w ? p.lead : p.eventLead;
  const story = w
    ? "Queremos que seas parte de un día que recordaremos siempre."
    : "Una ocasión para reunirnos, reír y crear nuevos recuerdos.";
  const elements = [guest];
  if (p.story === "split")
    elements.push(
      text("intro", lead, inset, 280, 285, 300, 54),
      photo("sample-photo", 410, 270, 230, 580),
      text("story", story, inset, 675, 285, 280, 36),
    );
  if (p.story === "portrait")
    elements.push(
      text("intro", lead, inset, 260, 720 - 2 * inset, 150, 56),
      photo("sample-photo", 105, 470, 510, 420, true),
      text("story", story, inset, 950, 720 - 2 * inset, 130, 34),
    );
  if (p.story === "letter")
    elements.push(
      text("intro", lead, inset, 300, 720 - 2 * inset, 160, 62),
      text("story", story, inset, 535, 720 - 2 * inset, 210, 38),
      photo("sample-photo", 210, 800, 300, 230, true),
    );
  if (p.story === "album")
    elements.push(
      text("intro", lead, inset, 260, 720 - 2 * inset, 160, 58),
      photo("sample-photo", 80, 485, 345, 375),
      photo("memory-top", 455, 485, 185, 165),
      photo("memory-bottom", 455, 695, 185, 165),
      text("story", story, inset, 940, 720 - 2 * inset, 130, 34),
    );
  if (p.story === "panorama")
    elements.push(
      text("intro", lead, inset, 260, 720 - 2 * inset, 180, 60),
      photo("sample-photo", 0, 490, 720, 350),
      text("story", story, inset, 940, 720 - 2 * inset, 140, 36),
    );
  if (p.story === "statement")
    elements.push(
      text("intro", lead, inset, 280, 720 - 2 * inset, 380, 84),
      text("story", story, inset, 760, 280, 270, 36),
      photo("sample-photo", 425, 760, 215, 270),
    );
  return templatePage(
    t,
    w ? "Nuestra historia" : "Nos reunimos",
    1120,
    elements,
  );
}
