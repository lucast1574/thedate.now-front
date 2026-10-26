import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
export function useLocationAddress(
  id: string,
  link: string,
  onAddress: (address: string) => void,
) {
  const generation = useRef(0);
  const [requestLink, setRequestLink] = useState("");
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState("");
  useEffect(
    () => () => {
      generation.current++;
    },
    [id, link],
  );
  async function resolve() {
    const attempt = ++generation.current;
    setRequestLink(link);
    setBusy(true);
    setStatus("");
    try {
      const result = await api<{ address: string }>(
        "/api/backend/maps/resolve",
        "POST",
        { url: link },
      );
      if (attempt === generation.current) {
        onAddress(result.address);
        setStatus(
          "Dirección encontrada. Revísala antes de guardar. © OpenStreetMap contributors",
        );
      }
    } catch (error) {
      if (attempt === generation.current) setStatus((error as Error).message);
    } finally {
      if (attempt === generation.current) setBusy(false);
    }
  }
  return {
    busy: busy && requestLink === link,
    status: requestLink === link ? status : "",
    resolve,
  };
}
