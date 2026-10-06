import type { ImgHTMLAttributes } from "react";

// Keep native image requests: private photos require the current session cookie,
// and public photos are already streamed by the API. Do not proxy through Next's optimizer.
export default function Photo(props: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element -- Preserve authenticated media requests.
  return <img {...props} alt={props.alt ?? ""} />;
}
