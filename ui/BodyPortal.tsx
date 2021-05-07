import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { useIsomorphicLayoutEffect } from "react-use";

interface Props {
  children: ReactNode;
}

export function BodyPortal({ children }: Props) {
  const body = useBody();

  if (!body) return null;

  return createPortal(children, body);
}

export function useBody() {
  const [body, setBody] = useState<HTMLBodyElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    setBody(document.body as HTMLBodyElement);
  });

  return body;
}
