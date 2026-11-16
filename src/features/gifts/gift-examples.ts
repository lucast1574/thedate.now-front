import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
import type { GuestWishlist } from "@/lib/events/wishlist";
export const exampleToken = "0123456789abcdef".repeat(3);
export const exampleProducts = localized((i18n: Translator) => [
  {
    id: "example-coffee",
    title: i18n("Cafetera programable Oster · 12 tazas"),
    url: "https://www.falabella.com.pe/falabella-pe/product/20926138/cafetera-programable-12-tazas-negra-oster/20926138",
    description: i18n("Para los cafés del domingo y las sobremesas en casa."),
    image: "/gift-examples/cafetera.jpg",
  },
  {
    id: "example-speaker",
    title: i18n("Parlante portátil JBL Go 4"),
    url: "https://www.mercadolibre.com.pe/altavoz-portatil-jbl-go4-con-bluetooth-impermeable-negro/p/MPE37926169",
    description: i18n("Un poco de música para acompañar nuestros planes."),
    image: "/gift-examples/parlante.jpg",
  },
  {
    id: "example-headphones",
    title: i18n("Audífonos inalámbricos JBL Tune 520BT"),
    url: "https://www.coolbox.pe/audifonos-jbl-tune-520bt-bluetooth-57h-ic-tune520ng/p",
    description: i18n(
      "Un detalle para disfrutar de nuestras canciones favoritas.",
    ),
    image: "/gift-examples/audifonos.png",
  },
]);
export function exampleWishlist(
  wedding: boolean,
  i18n: Translator = spanishTranslator,
): GuestWishlist {
  return {
    event: {
      id: "preview",
      kind: wedding ? "wedding" : "general",
      slug: "celebracion",
      title: wedding
        ? "Valentina & Mateo"
        : i18n("La celebración de Valentina"),
    },
    guestName: i18n("Lucía"),
    version: 0,
    items: exampleProducts(i18n).map(({ image: _image, ...item }, index) => ({
      ...item,
      hasImage: true,
      reserved: index === 2,
      mine: false,
      delivered: false,
    })),
  };
}
