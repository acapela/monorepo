import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ClientOnlyPortalProps {
  children: ReactNode;
  selector: string;
}

/**
 * React Portal implementation for Next.js
 * @link https://github.com/vercel/next.js/tree/canary/examples/with-portals
 */
export function ClientOnlyPortal({ children, selector }: ClientOnlyPortalProps) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  if (!mounted || !ref.current) {
    return null;
  }

  return createPortal(children, ref.current);
}
