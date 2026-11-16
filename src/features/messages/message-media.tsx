import Image from "next/image";
import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import type { InboxMessage } from "./types";
export function mediaURL(eventId: string, id: string) {
  return `/api/message-media/${eventId}/${id}`;
}
export default function MessageMedia({ message }: { message: InboxMessage }) {
  const i18n = useTranslator(),
    media = message.media;
  if (!media) return null;
  const url = mediaURL(message.eventId, message.id);
  return (
    <div className="inbox-media">
      {media.available ? (
        <>
          {media.mime.startsWith("image/") && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={i18n("Abrir imagen original")}
            >
              <Image
                unoptimized
                src={url}
                alt={media.filename || i18n("Imagen enviada por el invitado")}
                width={900}
                height={1200}
              />
            </a>
          )}
          {media.mime.startsWith("audio/") && (
            <audio
              controls
              preload="none"
              src={url}
              aria-label={i18n("Audio del invitado")}
            />
          )}
          {media.mime.startsWith("video/") && (
            <video
              controls
              preload="metadata"
              src={url}
              aria-label={i18n("Video del invitado")}
            />
          )}
          <a href={url} target="_blank" rel="noreferrer">
            <Icon name="lucide:paperclip" />
            {media.filename || i18n("Abrir adjunto")}
          </a>
        </>
      ) : (
        <p>
          <Icon name="lucide:paperclip" />
          {i18n("Adjunto recibido. El archivo todavía no está disponible.")}
        </p>
      )}
    </div>
  );
}
