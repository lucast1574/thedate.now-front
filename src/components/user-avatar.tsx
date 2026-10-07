import { useState } from "react";
import Photo from "./photo";
import type { User } from "@/lib/events/types";
export default function UserAvatar({ user }: { user: User }) {
  const [failed, setFailed] = useState("");
  const src = user.avatarVersion
    ? `/api/profile/avatar?v=${user.avatarVersion}`
    : user.googlePhotoUrl;
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return (
    <span className="user-avatar" aria-hidden="true">
      {src && failed !== src ? (
        <Photo
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(src)}
        />
      ) : (
        initials
      )}
    </span>
  );
}
