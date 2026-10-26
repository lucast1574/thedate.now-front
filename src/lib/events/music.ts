export type InvitationMusic = {
  source: "mp3" | "spotify" | "youtube";
  value: string;
  title: string;
};
export function musicFromLink(input: string): InvitationMusic | null {
  try {
    const url = new URL(input.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port)
      return null;
    if (url.hostname === "open.spotify.com") {
      const path = url.pathname.replace(/^\/intl-[a-z]+\//, "/");
      if (/^\/(track|album|playlist)\/[a-zA-Z0-9]{22}$/.test(path))
        return {
          source: "spotify",
          value: `https://open.spotify.com${path}`,
          title: "Nuestra música",
        };
    }
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
  if (
    music.source === "spotify" &&
    musicFromLink(music.value)?.source === "spotify"
  )
    return music.value.replace("open.spotify.com/", "open.spotify.com/embed/");
  if (music.source === "youtube" && /^[A-Za-z0-9_-]{11}$/.test(music.value))
    return `https://www.youtube-nocookie.com/embed/${music.value}?playsinline=1`;
  return null;
}
