/* eslint-disable @next/next/no-img-element -- Satori renders raster images. */
import type { PublicEvent } from "@/lib/events/types";
import { elementValue } from "@/lib/events/element-values";
import { personalizedText } from "@/lib/events/guest-name";
import { visibleInvitationSection } from "@/lib/events/section-visibility";
import { formatEventDate } from "@/lib/events/date";

export default function ShareCover({
  event,
  photos,
}: {
  event: PublicEvent;
  photos: Record<string, string>;
}) {
  const section = event.sections?.find((s) =>
    visibleInvitationSection(s, event),
  );
  const canvas = section?.canvas;
  const scale = canvas ? Math.min(440 / canvas.width, 566 / canvas.height) : 1;
  const background = canvas?.backgroundOverride
    ? undefined
    : canvas?.backgroundImage || event.backgroundImage;
  const cover = section?.photoKey || event.photoKeys?.[0];
  return (
    <div
      style={{
        display: "flex",
        width: 1200,
        height: 630,
        padding: 32,
        gap: 48,
        background: "#f3f0ec",
        color: "#201b26",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 460,
          height: 566,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: canvas ? canvas.width * scale : 440,
            height: canvas ? canvas.height * scale : 566,
            background: canvas?.background || "#fff",
            overflow: "hidden",
          }}
        >
          {background && photos[background.photoKey] && (
            <img
              alt=""
              src={photos[background.photoKey]}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: background.fit,
                opacity: background.opacity,
              }}
            />
          )}
          {canvas ? (
            canvas.elements.slice(0, 60).map((original) => {
              const item = elementValue(original, event);
              if (item.type === "icon") return null;
              const photo = item.photoKey && photos[item.photoKey];
              return (
                <div
                  key={item.id}
                  style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    left: item.x * scale,
                    top: item.y * scale,
                    width: item.width * scale,
                    height: item.height * scale,
                    transform: `rotate(${item.rotation}deg)`,
                    color: item.color,
                    fontSize: Math.max(8, item.fontSize * scale),
                    fontWeight: item.bold ? 700 : 400,
                    fontStyle: item.italic ? "italic" : "normal",
                    textAlign: item.align,
                    whiteSpace: "pre-wrap",
                    overflow: "hidden",
                    opacity: item.opacity ?? 1,
                  }}
                >
                  {photo ? (
                    <img
                      alt=""
                      src={photo}
                      width={item.width * scale}
                      height={item.height * scale}
                      style={{ objectFit: item.photoFit || "cover" }}
                    />
                  ) : item.type === "text" ? (
                    personalizedText(item)
                  ) : null}
                </div>
              );
            })
          ) : cover && photos[cover] ? (
            <img
              alt=""
              src={photos[cover]}
              width={440}
              height={566}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 36,
                fontSize: 52,
                color: event.accentColor,
              }}
            >
              {event.title}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 620,
          gap: 24,
        }}
      >
        <div style={{ fontSize: 26, color: event.accentColor }}>
          {event.kind === "wedding" ? "Save the Date" : "The Date"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: event.title.length > 65 ? 44 : 54,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {event.title.slice(0, 120)}
        </div>
        <div style={{ fontSize: 26, color: "#605866" }}>
          {formatEventDate(event.startAt, event.timeZone)}
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "18px 26px",
            background: event.accentColor || "#66399e",
            color: "#fff",
            borderRadius: 10,
            fontSize: 26,
          }}
        >
          Abre tu invitación
        </div>
      </div>
    </div>
  );
}
