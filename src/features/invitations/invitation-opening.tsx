"use client";
import { useEffect, useRef } from "react";
import OpeningScene from "./opening-scene";
import { useOpeningAnimation } from "./use-opening-animation";
import type { Opening } from "@/lib/events/celebration";
export default function InvitationOpening({
  opening,
  title,
  wedding,
  photoURL,
}: {
  opening: Opening;
  title: string;
  wedding: boolean;
  photoURL: (key: string) => string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { phase, open } = useOpeningAnimation(opening.style);
  const done = phase === "done";
  useEffect(() => {
    const node = dialog.current,
      doc = node?.ownerDocument;
    if (!node || !doc || done) return;
    const overflow = doc.body.style.overflow;
    doc.body.style.overflow = "hidden";
    node.showModal();
    return () => {
      node.close();
      doc.body.style.overflow = overflow;
    };
  }, [done]);
  if (done) return null;
  return (
    <dialog
      ref={dialog}
      className="invitation-opening"
      aria-labelledby="opening-title"
      onCancel={(e) => {
        e.preventDefault();
        open(dialog.current);
      }}
    >
      <OpeningScene
        opening={opening}
        title={title}
        wedding={wedding}
        photoURL={photoURL}
        phase={phase}
        onOpen={() => open(dialog.current)}
      />
    </dialog>
  );
}
