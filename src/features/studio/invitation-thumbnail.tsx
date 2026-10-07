import { useEffect, useRef, useState } from "react";
import { thumbnailFit } from "@/lib/events/thumbnail";
import { createPortal } from "react-dom";
import Invitation from "@/features/invitations/invitation";
import type { Event } from "@/lib/events/types";
export default function InvitationThumbnail({ event }: { event: Event }) {
  const ref = useRef<HTMLDivElement>(null),
    [visible, setVisible] = useState(false),
    [size, setSize] = useState({ width: 390, height: 292.5 }),
    [contentHeight, setContentHeight] = useState(780),
    [body, setBody] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const resize = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
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
  useEffect(() => {
    if (!body) return;
    const measure = () => {
      const target = body.querySelector(
        event.designMode === "flyer" ? ".flyer-surface" : ".description",
      );
      if (target) setContentHeight(target.getBoundingClientRect().bottom + 24);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    const content = body.querySelector(".invite-content");
    if (content) observer.observe(content);
    measure();
    return () => observer.disconnect();
  }, [body, event.designMode]);
  const fit = thumbnailFit(size.width, size.height, contentHeight);
  return (
    <div ref={ref} className="invitation-thumbnail" aria-hidden="true">
      {visible && (
        <iframe
          tabIndex={-1}
          title={`Miniatura de ${event.title}`}
          sandbox="allow-same-origin"
          style={{
            width: 390,
            height: contentHeight,
            left: fit.left,
            transform: `scale(${fit.scale})`,
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
              "html,body{margin:0;overflow:clip;pointer-events:none}.invitation{min-height:0}.invite-top{display:none}.invite-content{margin:0 auto;padding-top:24px}.invite-content .ornament{margin:12px auto;font-size:32px}.invite-content .ornament svg{width:40px;height:40px}.invite-content h1{font-size:40px}.invite-content .rule{margin:20px auto}.invite-content .description{font-size:20px}.invite-content .eyebrow{margin:12px auto}";
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
