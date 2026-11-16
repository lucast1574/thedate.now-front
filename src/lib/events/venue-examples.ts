import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { emptyPlan, type SeatingPlan } from "./seating";
export const exampleSeatingPlan = (
  wedding = true,
  i18n: Translator = spanishTranslator,
): SeatingPlan => ({
  ...emptyPlan(),
  tables: [
    {
      id: "a",
      name: i18n("Familia"),
      shape: "round",
      capacity: 8,
      x: 160,
      y: 300,
      rotation: 0,
    },
    {
      id: "b",
      name: i18n("Amigos"),
      shape: "round",
      capacity: 6,
      x: 1200,
      y: 300,
      rotation: 0,
    },
    {
      id: "c",
      name: i18n("Mesa principal"),
      shape: "rectangle",
      capacity: 8,
      x: 680,
      y: 760,
      rotation: 0,
    },
    {
      id: "d",
      name: wedding ? i18n("Familia de Sofía") : i18n("Compañeros de estudios"),
      shape: "round",
      capacity: 8,
      x: 180,
      y: 600,
      rotation: 0,
    },
    {
      id: "e",
      name: wedding ? i18n("Familia de Mateo") : i18n("Vecinos"),
      shape: "round",
      capacity: 8,
      x: 1200,
      y: 600,
      rotation: 0,
    },
    {
      id: "f",
      name: wedding ? i18n("Compañeros") : i18n("Equipo o club"),
      shape: "round",
      capacity: 6,
      x: 640,
      y: 100,
      rotation: 0,
    },
  ],
});
