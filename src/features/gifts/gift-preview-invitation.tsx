import FlyerGiftLink from "@/components/flyer-gift-link";
import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";
const gift: FlyerElement = {
  id: "preview-gifts",
  type: "text",
  binding: "gift_link",
  link: "/regalos",
  text: "Nuestra lista de regalos",
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
  hintText: "Ver regalos",
};
export default function GiftPreviewInvitation({
  title,
  wedding,
  onOpen,
}: {
  title: string;
  wedding: boolean;
  onOpen: () => void;
}) {
  return (
    <section
      className="gift-preview-invitation"
      aria-label="Elemento de regalos en la invitación"
    >
      <div>
        <span className="gift-preview-label">Así lo encuentra tu invitado</span>
        <h3>{title}</h3>
        <p>
          {wedding
            ? "Tu compañía es nuestro mejor regalo. Si quieres tener un detalle, aquí encontrarás nuestra lista de deseos."
            : "Tu compañía es lo más importante. Si quieres tener un detalle, aquí encontrarás la lista de deseos."}
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
              ...gift,
              text: wedding ? "Nuestra lista de regalos" : "Lista de deseos",
            }}
          />
        </div>
        <p>
          <Icon name="check" /> La lista se abre directamente. La app reconoce
          el acceso personal del invitado.
        </p>
      </div>
    </section>
  );
}
