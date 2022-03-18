import React, { ReactNode, useEffect, useState } from "react";

import { createTimeout } from "@aca/shared/time";

interface Props {
  children: ReactNode[];
  initialCount?: number;
  addBatchSize?: number;
  batchInterval?: number;
}

/**
 * Requires children to be array (usually result of [].map) and will not render all of them initially,
 * but will gradually increase
 */
export function LazyChildrenRender({ children, initialCount = 10, addBatchSize = 20, batchInterval = 200 }: Props) {
  const [renderCount, setRenderCount] = useState(initialCount);

  const totalCount = children.length;

  useEffect(() => {
    if (renderCount >= totalCount) {
      if (Math.abs(totalCount - renderCount) > addBatchSize) {
        setRenderCount(totalCount);
      }
      return;
    }

    return createTimeout(() => {
      setRenderCount((oldCount) => oldCount + addBatchSize);
    }, batchInterval);
  }, [renderCount, totalCount, addBatchSize, batchInterval]);

  return <>{children.slice(0, renderCount)}</>;
}
