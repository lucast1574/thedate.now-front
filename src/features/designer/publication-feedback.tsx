"use client";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import PublicationSuccess from "./publication-success";

const Feedback = createContext<((title: string) => void) | null>(null);
export function usePublicationFeedback() {
  const notify = useContext(Feedback);
  if (!notify) throw new Error("Publication feedback provider is missing");
  return notify;
}
export default function PublicationFeedback({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [receipt, setReceipt] = useState<{
    title: string;
    from: string;
    started: boolean;
  } | null>(null);
  const notify = useCallback(
    (title: string) => {
      setReceipt({ title, from: pathname, started: false });
    },
    [pathname],
  );
  const close = useCallback(() => setReceipt(null), []);
  const start = useCallback(
    () =>
      setReceipt((current) =>
        current && !current.started ? { ...current, started: true } : current,
      ),
    [],
  );
  return (
    <Feedback.Provider value={notify}>
      {children}
      {receipt && (receipt.started || pathname !== receipt.from) && (
        <PublicationSuccess
          title={receipt.title}
          onClose={close}
          onStart={start}
        />
      )}
    </Feedback.Provider>
  );
}
