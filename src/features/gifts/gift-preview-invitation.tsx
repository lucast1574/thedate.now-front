import { useTranslator } from "@/lib/i18n/react";
import { type Translator, localized } from "@/lib/i18n/translator";
import FlyerGiftLink from "@/components/flyer-gift-link";
import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";
const gift = localized((i18n: Translator): FlyerElement => ({
  id: "preview-gifts",
  type: "text",
  binding: "gift_link",
  link: "/regalos",
  text: i18n("Nuestra lista de regalos"),
  x: 0,
  y: 0,
  width: 400,
  height: 100,
  rotation: 0,
  color: "#8b6548",
  font: "serif",
  fontSize: 30,
  bold: false,
  align: "center",
  actionHint: true,
  hintText: i18n("Ver regalos"),
}));
export default function GiftPreviewInvitation({
  title,
  wedding,
  onOpen,
}: {
  title: string;
  wedding: boolean;
  onOpen: () => void;
}) {
  const i18n = useTranslator();

  return (
    <section
      className="gift-preview-invitation"
      aria-label={i18n("Elemento de regalos en la invitación")}
    >
      <div>
        <span className="gift-preview-label">
          {i18n("Así lo encuentra tu invitado")}
        </span>
        <h3>{title}</h3>
        <p>
          {wedding
            ? i18n(
                "Tu compañía es nuestro mejor regalo. Si quieres tener un detalle, aquí encontrarás nuestra lista de deseos.",
              )
            : i18n(
                "Tu compañía es lo más importante. Si quieres tener un detalle, aquí encontrarás la lista de deseos.",
              )}
        </p>
      </div>
      <div className="gift-preview-element">
        <div
          onClickCapture={(e) => {
            e.preventDefault();
            onOpen();
          }}
        >
          <FlyerGiftLink
            item={{
              ...gift(i18n),
              text: wedding
                ? i18n("Nuestra lista de regalos")
                : i18n("Lista de deseos"),
            }}
          />
        </div>
        <p>
          <Icon name="check" />{" "}
          {i18n(
            "La lista se abre directamente. La app reconoce el acceso personal del invitado.",
          )}
        </p>
      </div>
    </section>
  );
}
