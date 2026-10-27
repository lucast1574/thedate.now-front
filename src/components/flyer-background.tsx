import Photo from "./photo";
import { templatePhotoURL } from "@/lib/events/template-photos";
import type { BackgroundSlice } from "@/lib/events/background";
export default function FlyerBackground({
  slice,
  photoURL,
}: {
  slice: BackgroundSlice;
  photoURL: (key: string) => string;
}) {
  const { image, offset, total, height } = slice;
  return (
    <div
      className="flyer-background"
      aria-hidden="true"
      data-background-key={image.photoKey}
      style={{ opacity: image.opacity }}
    >
      <Photo
        alt=""
        draggable={false}
        src={templatePhotoURL(image.photoKey) || photoURL(image.photoKey)}
        style={{
          top: `${(-100 * offset) / height}%`,
          height: `${(100 * total) / height}%`,
          objectFit: image.fit,
          objectPosition: image.position,
        }}
      />
    </div>
  );
}
