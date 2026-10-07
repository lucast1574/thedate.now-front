import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Invitation from "@/features/invitations/invitation";
import type { Event } from "@/lib/events/types";
export default function InvitationThumbnail({ event }: { event: Event }) {
  const ref = useRef<HTMLDivElement>(null),
    [visible, setVisible] = useState(false),
    [width, setWidth] = useState(390),
    [body, setBody] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const resize = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    resize.observe(node);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(node);
    return () => {
      resize.disconnect();
      observer.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className="invitation-thumbnail" aria-hidden="true">
      {visible && (
        <iframe
          tabIndex={-1}
          title={`Miniatura de ${event.title}`}
          sandbox="allow-same-origin"
          style={{
            width: 390,
            height: 780,
            transform: `scale(${width / 390})`,
          }}
          srcDoc={
            '<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body></body></html>'
          }
          onLoad={(e) => {
            const doc = e.currentTarget.contentDocument;
            if (!doc) return;
            for (const node of document.querySelectorAll(
              'link[rel="stylesheet"], style',
            ))
              doc.head.appendChild(node.cloneNode(true));
            const style = doc.createElement("style");
            style.textContent =
              "html,body{margin:0;overflow:clip;pointer-events:none}.invite-top{display:none}.invite-content{margin:0 auto;padding-top:24px}.invite-content .ornament{margin:12px auto;font-size:32px}.invite-content .ornament svg{width:40px;height:40px}.invite-content h1{font-size:40px}.invite-content .rule{margin:20px auto}.invite-content .description{font-size:20px}.invite-content .eyebrow{margin:12px auto}";
            doc.head.appendChild(style);
            setBody(doc.body);
          }}
        />
      )}
      {body &&
        createPortal(
          <Invitation
            event={event}
            preview={true}
            photoURL={(key) =>
              `/api/photos/${event.id}/${encodeURIComponent(key)}`
            }
          />,
          body,
        )}
    </div>
  );
}
