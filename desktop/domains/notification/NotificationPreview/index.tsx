import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import { openNotificationInApp, resolveNotification, snoozeNotification } from "@aca/desktop/actions/notification";
import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { previewEventsBridge, requestAttachPreview, updatePreviewPosition } from "@aca/desktop/bridge/preview";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { PreviewPosition, getPreviewPositionFromElement } from "@aca/desktop/domains/preview";
import { SYSTEM_BAR_HEIGHT } from "@aca/desktop/ui/systemTopBar/ui";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { useEqualState } from "@aca/shared/hooks/useEqualState";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";
import { useAutorun } from "@aca/shared/sharedState";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { Button } from "@aca/ui/buttons/Button";
import { describeShortcut } from "@aca/ui/keyboard/describeShortcut";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

import { runActionWithTarget } from "../../runAction";
import { handlePreviewMouseManagement } from "./useManagePreviewMouseHandling";

type Props = {
  notification: NotificationEntity;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const NotificationPreview = observer(function NotificationPreview({ notification, onFocus, onBlur }: Props) {
  const url = notification.url;
  const [position, setPosition] = useEqualState<PreviewPosition | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);

  const previewShapeHolderRef = useRef<HTMLDivElement>(null);

  useAutorun(() => {
    if (preloadingNotificationsBridgeChannel.get()[url] === "error") {
      setHasError(true);
    } else {
      setHasError(false);
    }
  });

  useResizeCallback(previewShapeHolderRef, (entry) => {
    setPosition(getPreviewPositionFromElement(entry.target as HTMLElement));
  });

  useEffect(() => {
    const url = notification.url;
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

      if (event.type === "snooze-request") {
        runActionWithTarget(snoozeNotification, notification);
      }

      if (event.type === "resolve-request") {
        runActionWithTarget(resolveNotification, notification);
      }

      if (event.type === "open-in-app-request") {
        runActionWithTarget(openNotificationInApp, notification);
      }
    });
  }, [notification, onFocus, onBlur]);

  useDependencyChangeEffect(() => {
    if (!position) return;
    return updatePreviewPosition({ position, url });
  }, [position]);

  useLayoutEffect(() => {
    const previewElement = previewShapeHolderRef.current;

    if (!previewElement) return;
    if (devSettingsStore.hidePreviews) return;
    if (!position) return;
    if (hasError) return;

    const stopAttaching = requestAttachPreview({ url, position });
    const stopMouseManagement = handlePreviewMouseManagement(url, previewElement);

    return () => {
      stopMouseManagement();
      stopAttaching?.();
    };
  }, [
    url,
    // Cast position to boolean, as we only want to wait for position to be ready. We don't want to re-run this effect when position changes
    !!position,
    devSettingsStore.hidePreviews,
    hasError,
  ]);

  return (
    <>
      <UIHolder ref={previewShapeHolderRef}>
        <BodyPortal>
          <AnimatePresence>
            {isFocused && (
              <UIEscapeFlyer presenceStyles={{ opacity: [0, 1] }}>
                <UIEscapeLabel presenceStyles={{ y: [10, 0] }}>
                  Press {describeShortcut(["Mod", "Esc"])} to return
                </UIEscapeLabel>
              </UIEscapeFlyer>
            )}
          </AnimatePresence>
        </BodyPortal>

        {hasError && (
          <UIErrorHolder>
            <UIErrorLabel>
              Failed to load <UIErrorUrlLabel>{url}</UIErrorUrlLabel>
            </UIErrorLabel>
            <Button
              onClick={() => {
                setHasError(false);
              }}
            >
              Try again
            </Button>
          </UIErrorHolder>
        )}
      </UIHolder>
    </>
  );
});

const UIHolder = styled.div`
  width: 100%;
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIEscapeFlyer = styled(PresenceAnimator)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  isolation: isolate;
  z-index: 1000;
  height: ${SYSTEM_BAR_HEIGHT}px;
  ${theme.colors.layout.background.opacity(0.9).asBg};
  pointer-events: all;
`;

const UIEscapeLabel = styled(PresenceAnimator)`
  ${theme.typo.content.medium};
  ${theme.colors.layout.actionPanel.asBgWithReadableText};
  ${theme.box.panel.hint.padding.radius};
  ${theme.radius.primaryItem};
`;

const UIErrorHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  max-width: 320px;
  text-align: center;
`;

const UIErrorLabel = styled.div`
  ${theme.typo.content.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  max-width: 320px;
`;

const UIErrorUrlLabel = styled.div`
  opacity: 0.6;
  ${theme.typo.label};
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  max-width: 100%;
  text-overflow: ellipsis;
`;
