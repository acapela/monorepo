import { useDocument } from "@aca/shared/context/window";
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
  const document = useDocument();
  const [body, setBody] = useState<HTMLBodyElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!document) return;
    setBody(document.body as HTMLBodyElement);
  });

  return body;
}
