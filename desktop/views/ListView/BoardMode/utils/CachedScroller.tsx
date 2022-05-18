import React, { HTMLAttributes, useEffect } from "react";

import { styledForwardRef } from "@aca/shared/component";
import { useSharedRef } from "@aca/shared/hooks/useSharedRef";

import { makeScrollMeasurmentsCached } from "./scrollMeasureCache";

export const CachedScroller = styledForwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CachedScroller(
  props,
  forwardedRef
) {
  const sharedRef = useSharedRef(null, [forwardedRef]);

  useEffect(() => {
    makeScrollMeasurmentsCached(sharedRef.current!);
  }, []);
  return <div ref={sharedRef} {...props}></div>;
})``;
