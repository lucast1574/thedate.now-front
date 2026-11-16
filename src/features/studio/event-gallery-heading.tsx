import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
export default function EventGalleryHeading({
  wedding,
  onCreate,
}: {
  wedding: boolean;
  onCreate: () => void;
}) {
  const i18n = useTranslator();
  return (
    <div className="gallery-heading">
      <div>
        <p className="office-kicker">
          {wedding
            ? i18n("SAVE THE DATE · TU ESTUDIO")
            : i18n("THE DATE · QUE EMPIECE LA FIESTA")}
        </p>
        <h1>
          {wedding ? (
            <>
              {i18n("Cada historia merece")} <br />
              <em>{i18n("su invitación.")}</em>
            </>
          ) : (
            <>
              {i18n("Tus planes.")} <br />
              <em>{i18n("Grandes momentos.")}</em>
            </>
          )}
        </h1>
        <p>
          {wedding
            ? i18n("Un espacio para diseñar, imaginar y celebrar juntos.")
            : i18n("Crea algo que se sienta tan único como tu celebración.")}
        </p>
      </div>
      <button className="gallery-create" onClick={onCreate}>
        <Icon name="plus" />
        {wedding ? i18n("Crear una boda") : i18n("Crear un evento")}
      </button>
    </div>
  );
}
