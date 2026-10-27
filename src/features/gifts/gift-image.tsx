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
  const [failedSource, setFailedSource] = useState<string>();
  return (
    <div className="gift-image">
      {src && src !== failedSource ? (
        <Photo
          src={src}
          alt={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedSource(src)}
        />
      ) : (
        <Icon name="lucide:gift" />
      )}
    </div>
  );
}
