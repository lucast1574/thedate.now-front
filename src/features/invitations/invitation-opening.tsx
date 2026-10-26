"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icon";
import type { Opening } from "@/lib/events/celebration";
export default function InvitationOpening({
  opening,
  title,
  wedding,
}: {
  opening: Opening;
  title: string;
  wedding: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const done = phase === "done";
  useEffect(() => {
    const node = dialog.current;
    const doc = node?.ownerDocument;
    if (!node || !doc || done) return;
    const overflow = doc.body.style.overflow;
    doc.body.style.overflow = "hidden";
    node.showModal();
    return () => {
      node.close();
      doc.body.style.overflow = overflow;
    };
  }, [done]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    const reduced = dialog.current?.ownerDocument.defaultView?.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    timer.current = setTimeout(() => setPhase("done"), reduced ? 0 : 650);
  }
  if (phase === "done") return null;
  return (
    <dialog
      ref={dialog}
      className="invitation-opening"
      data-style={opening.style}
      data-phase={phase}
      aria-labelledby="opening-title"
      onCancel={(e) => {
        e.preventDefault();
        open();
      }}
      style={
        {
          "--envelope-paper": opening.color,
          "--envelope-ink": opening.ink,
        } as React.CSSProperties
      }
    >
      <div className="opening-intro">
        <span>{wedding ? "Con todo nuestro cariño" : "Estás invitado"}</span>
        <h1 id="opening-title">{title}</h1>
        <p>{opening.message}</p>
      </div>
      <button
        className="opening-envelope"
        onClick={open}
        aria-label={opening.buttonLabel || "Abrir invitación"}
        disabled={phase === "opening"}
      >
        <span className="opening-letter" aria-hidden="true">
          <Icon name={wedding ? "flower" : "sparkle"} />
          <span>{title}</span>
        </span>
        <span className="opening-fold" aria-hidden="true" />
        <span className="opening-seal" aria-hidden="true">
          <Icon
            name={
              opening.style === "arch"
                ? "leaf"
                : opening.style === "ticket"
                  ? "ticket"
                  : wedding
                    ? "flower"
                    : "sparkle"
            }
          />
        </span>
      </button>
      <button
        className="opening-action"
        onClick={open}
        disabled={phase === "opening"}
      >
        {opening.buttonLabel || "Abrir invitación"}
        <Icon name="arrow" />
      </button>
    </dialog>
  );
}
