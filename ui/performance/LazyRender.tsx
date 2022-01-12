import { ReactNode, useEffect, useState } from "react";

import { createTimeout } from "@aca/shared/time";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  timeout?: number;
}

/**
 * It is useful if we have some heavy components to render, but we dont want to force react
 * to yield it all in one go. Children of this component will be rendered in next tick or later depending on 'timeout'
 */
export function LazyRender({ children, timeout = 0, fallback = null }: Props) {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    return createTimeout(() => setCanRender(true), timeout);
  }, [timeout]);

  if (!canRender) return <>{fallback}</>;

  return <>{children}</>;
}
