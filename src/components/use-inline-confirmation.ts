import { useEffect, useRef, useState } from "react";
export function useInlineConfirmation() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null),
    cancel = useRef<HTMLButtonElement>(null),
    previous = useRef(false);
  useEffect(() => {
    if (open) cancel.current?.focus();
    else if (previous.current) trigger.current?.focus();
    previous.current = open;
  }, [open]);
  return { open, setOpen, trigger, cancel };
}
