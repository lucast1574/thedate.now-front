"use client";
import { useState } from "react";
import Photo from "@/components/photo";
import Icon from "@/components/icon";
export default function GiftImage({
  src,
  title,
}: {
  src?: string;
  title: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="gift-image">
      {src && !failed ? (
        <Photo
          src={src}
          alt={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon name="lucide:gift" />
      )}
    </div>
  );
}
