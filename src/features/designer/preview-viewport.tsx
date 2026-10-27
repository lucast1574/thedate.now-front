import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Invitation from "@/features/invitations/invitation";
import type { Event } from "@/lib/events/types";
import { preparePreviewDocument } from "./prepare-preview-document";
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
  const [error, setError] = useState("");
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
      {error && <p role="alert">{error}</p>}
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
            onLoad={async (e) => {
              const frame = e.currentTarget;
              const doc = frame.contentDocument;
              if (!doc) return;
              try {
                const ready = await preparePreviewDocument(
                  doc,
                  document,
                  draft.kind,
                );
                if (frame.isConnected) setBody(ready);
              } catch (err) {
                if (frame.isConnected) setError((err as Error).message);
              }
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
