import React, { ReactNode, useEffect, useState } from "react";

import { createTimeout } from "@aca/shared/time";

interface Props {
  children: ReactNode[];
  initialCount?: number;
  addBatchSize?: number;
  batchInterval?: number;
  manualNextBatchTrigger?: (loadNext: () => void) => ReactNode;
}

/**
 * Requires children to be array (usually result of [].map) and will not render all of them initially,
 * but will gradually increase
 */
export function LazyChildrenRender({
  children,
  initialCount = 10,
  addBatchSize = 20,
  batchInterval = 200,
  manualNextBatchTrigger,
}: Props) {
  const [renderCount, setRenderCount] = useState(initialCount);

  const totalCount = children.length;

  const hasMore = totalCount > renderCount;

  function loadMore() {
    setRenderCount((oldCount) => oldCount + addBatchSize);
  }

  useEffect(() => {
    if (renderCount >= totalCount) {
      if (Math.abs(totalCount - renderCount) > addBatchSize) {
        setRenderCount(totalCount);
      }
      return;
    }

    if (manualNextBatchTrigger) return;

    return createTimeout(loadMore, batchInterval);
  }, [renderCount, totalCount, addBatchSize, batchInterval, manualNextBatchTrigger]);

  return (
    <>
      {children.slice(0, renderCount)}

      {hasMore && manualNextBatchTrigger && manualNextBatchTrigger(loadMore)}
    </>
  );
}
