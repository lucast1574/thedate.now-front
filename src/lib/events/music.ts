export type InvitationMusic = {
  // Spotify is retained only to read older saved designs, never to play/add it.
  source: "mp3" | "spotify" | "youtube";
  value: string;
  title: string;
};
export function musicFromLink(input: string): InvitationMusic | null {
  try {
    const url = new URL(input.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port)
      return null;
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : ["www.youtube.com", "youtube.com", "music.youtube.com"].includes(
              url.hostname,
            ) && url.pathname === "/watch"
          ? url.searchParams.get("v")
          : null;
    if (id && /^[A-Za-z0-9_-]{11}$/.test(id))
      return { source: "youtube", value: id, title: "Nuestra música" };
  } catch {}
  return null;
}
export function musicEmbed(music: InvitationMusic) {
  if (music.source === "youtube" && /^[A-Za-z0-9_-]{11}$/.test(music.value))
    return `https://www.youtube-nocookie.com/embed/${music.value}?playsinline=1`;
  return null;
}
