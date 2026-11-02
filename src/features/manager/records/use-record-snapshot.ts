import { useEffect, useState } from "react";

export function useRecordSnapshot<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void load()
      .then((next) => {
        if (active) setData(next);
      })
      .catch((error: Error) => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, [load, attempt]);
  return {
    data,
    error,
    retry: () => {
      setError("");
      setAttempt((value) => value + 1);
    },
  };
}
