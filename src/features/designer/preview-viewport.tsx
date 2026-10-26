import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Invitation from "@/features/invitations/invitation";
import type { Event } from "@/lib/events/types";
export default function PreviewViewport({
  draft,
  device,
  guestName,
}: {
  draft: Event;
  device: "mobile" | "desktop";
  guestName: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);
  const [size, setSize] = useState({ width: 402, height: 600 });
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const measure = () =>
      setSize({ width: element.clientWidth, height: element.clientHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);
  const width = device === "mobile" ? 390 : 1120;
  const scale = Math.min(1, Math.max(1, size.width) / (width + 12));
  const height = Math.max(1, size.height / scale - 12);
  return (
    <div className="preview-stage" ref={stage}>
      <div
        className="preview-viewport"
        style={{ width: (width + 12) * scale, height: size.height }}
      >
        <div
          className="preview-device"
          data-device={device}
          style={{
            width: width + 12,
            height: height + 12,
            transform: `scale(${scale})`,
          }}
        >
          <iframe
            title="Vista previa real de tu invitación"
            sandbox="allow-same-origin allow-modals"
            srcDoc={
              '<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Vista previa</title></head><body></body></html>'
            }
            onLoad={(e) => {
              const doc = e.currentTarget.contentDocument;
              if (!doc) return;
              doc.documentElement.className =
                document.documentElement.className;
              for (const node of document.querySelectorAll(
                'link[rel="stylesheet"], style',
              ))
                doc.head.appendChild(node.cloneNode(true));
              setBody(doc.body);
            }}
          />
          {body &&
            createPortal(
              <div
                onClickCapture={(e) => {
                  if ((e.target as HTMLElement).closest("a"))
                    e.preventDefault();
                }}
              >
                <Invitation
                  guestName={guestName}
                  event={draft}
                  preview={Boolean(draft.isDemo)}
                  audioURL={(key) => `/api/audio/${draft.id}/${key}`}
                  photoURL={(key) =>
                    `/api/photos/${draft.id}/${encodeURIComponent(key)}`
                  }
                />
              </div>,
              body,
            )}
        </div>
      </div>
    </div>
  );
}
