import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useIsomorphicLayoutEffect } from "react-use";

import { useWindow } from "@aca/shared/context/window";

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

function tryGetBody(targetWindow: Window) {
  try {
    return targetWindow.document.body as HTMLBodyElement;
  } catch (error) {
    return null;
  }
}

export function useBody() {
  const targetWindow = useWindow();
  const [body, setBody] = useState<HTMLBodyElement | null>(() => {
    if (!targetWindow) return null;

    return tryGetBody(targetWindow);
  });

  useIsomorphicLayoutEffect(() => {
    if (!targetWindow) return;

    setBody(targetWindow.document.body as HTMLBodyElement);
  }, [targetWindow]);

  return body;
}
