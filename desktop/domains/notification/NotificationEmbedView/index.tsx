import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import {
  previewEventsBridge,
  requestAttachPreview,
  requestPreviewPreload,
  updatePreviewPosition,
} from "@aca/desktop/bridge/preview";
import { PreviewPosition, getPreviewPositionFromElement } from "@aca/desktop/domains/preview";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { useEqualState } from "@aca/shared/hooks/useEqualState";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { theme } from "@aca/ui/theme";

type PreloadBrowserViewProps = { url: string };

type BrowserViewProps = { url: string; onFocus?: () => void; onBlur?: () => void };

export function PreloadNotificationEmbed({ url }: PreloadBrowserViewProps) {
  useEffect(() => {
    return requestPreviewPreload({ url });
  }, [url]);

  return <></>;
}

export function NotificationEmbedView({ url, onFocus, onBlur }: BrowserViewProps) {
  const [position, setPosition] = useEqualState<PreviewPosition | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  useResizeCallback(rootRef, (entry) => {
    setPosition(getPreviewPositionFromElement(entry.target as HTMLElement));
  });

  useEffect(() => {
    return previewEventsBridge.subscribe((event) => {
      if (event.url !== url) return;

      if (event.type === "focus") {
        onFocus?.();
        setIsFocused(true);
      }

      if (event.type === "blur") {
        onBlur?.();
        setIsFocused(false);
      }
    });
  }, [url, onFocus, onBlur]);

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

  return (
    <>
      <UIHolder ref={rootRef} />
      <BodyPortal>
        <UIFocusCover $isVisible={isFocused} />
      </BodyPortal>
    </>
  );
}

const UIHolder = styled.div`
  width: 100%;
  flex-grow: 1;
`;

const UIFocusCover = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  ${theme.colors.layout.background.opacity(0.8).asBg};
  pointer-events: ${(props) => (props.$isVisible ? "all" : "none")};
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: 0.15s all;
`;
