import React, { useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

import { requestAttachPreview, requestPreviewPreload, updatePreviewPosition } from "@aca/desktop/bridge/preview";
import { PreviewPosition, getPreviewPositionFromElement } from "@aca/desktop/domains/preview";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { useEqualState } from "@aca/shared/hooks/useEqualState";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";

type BrowserViewProps = { url: string };

export function PreloadBrowserView({ url }: BrowserViewProps) {
  useEffect(() => {
    return requestPreviewPreload({ url });
  }, [url]);

  return <></>;
}

export function BrowserViewBridge({ url }: BrowserViewProps) {
  const [position, setPosition] = useEqualState<PreviewPosition | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  useResizeCallback(rootRef, (entry) => {
    setPosition(getPreviewPositionFromElement(entry.target as HTMLElement));
  });

  useDependencyChangeEffect(() => {
    if (!position) return;
    updatePreviewPosition({ position, url });
  }, [position]);

  useLayoutEffect(() => {
    if (!position) return;
    return requestAttachPreview({ url, position });
  }, [
    url,
    // Cast position to boolean, as we only want to wait for position to be ready. We don't want to re-run this effect when position changes
    !!position,
  ]);

  return <UIHolder ref={rootRef} />;
}

const UIHolder = styled.div`
  width: 100%;
  flex-grow: 1;
`;
