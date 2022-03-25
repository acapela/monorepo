import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useIsomorphicLayoutEffect } from "react-use";

interface Props {
  children: ReactNode;
  onReady?: () => void;
}

export function BodyPortal({ children, onReady }: Props) {
  const body = useBody();

  useEffect(() => {
    if (body) {
      onReady?.();
    }
  }, [body]);

  if (!body) return null;

  return createPortal(children, body);
}

function tryGetBody() {
  try {
    return document.body as HTMLBodyElement;
  } catch (error) {
    return null;
  }
}

export function useBody() {
  const [body, setBody] = useState<HTMLBodyElement | null>(tryGetBody);

  useIsomorphicLayoutEffect(() => {
    if (!body) {
      setBody(document.body as HTMLBodyElement);
    }
  });

  return body;
}
