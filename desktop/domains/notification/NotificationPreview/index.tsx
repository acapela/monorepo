import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import { openNotificationInApp, resolveNotification } from "@aca/desktop/actions/notification";
import { snoozeNotification } from "@aca/desktop/actions/snooze";
import { previewEventsBridge, requestAttachPreview, updatePreviewPosition } from "@aca/desktop/bridge/preview";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { commandMenuStore } from "@aca/desktop/domains/commandMenu/store";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { PreviewPosition, getPreviewPositionFromElement } from "@aca/desktop/domains/preview";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { useEqualState } from "@aca/shared/hooks/useEqualState";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { describeShortcut } from "@aca/ui/keyboard/describeShortcut";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

import { runActionWithTarget } from "../../runAction";

type Props = {
  notification: NotificationEntity;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const NotificationPreview = observer(function NotificationPreview({ notification, onFocus, onBlur }: Props) {
  const url = notification.url;
  const [position, setPosition] = useEqualState<PreviewPosition | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  useResizeCallback(rootRef, (entry) => {
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
    if (devSettingsStore.hidePreviews) return;
    if (!position || !!commandMenuStore.session) return;
    return requestAttachPreview({ url, position });
  }, [
    !!commandMenuStore.session,
    url,
    // Cast position to boolean, as we only want to wait for position to be ready. We don't want to re-run this effect when position changes
    !!position,
    devSettingsStore.hidePreviews,
  ]);

  return (
    <>
      <UIHolder ref={rootRef}>
        <AnimatePresence>
          {isFocused && (
            <UIEscapeFlyer presenceStyles={{ opacity: [0, 1], y: [-10, 0] }}>
              <UIEscapeLabel>Press {describeShortcut(["Mod", "Esc"])} to return</UIEscapeLabel>
            </UIEscapeFlyer>
          )}
        </AnimatePresence>
      </UIHolder>
      <BodyPortal>
        <UIFocusCover $isVisible={isFocused} />
      </BodyPortal>
    </>
  );
});

const UIHolder = styled.div`
  width: 100%;
  flex-grow: 1;
  ${theme.colors.layout.backgroundAccent.asBg};
  position: relative;
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

const UIEscapeFlyer = styled(PresenceAnimator)`
  position: absolute;
  bottom: 100%;
  margin-bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  isolation: isolate;
  z-index: 1000;
`;

const UIEscapeLabel = styled.div`
  ${theme.typo.content.medium};
  ${theme.colors.layout.actionPanel.asBgWithReadableText};
  ${theme.box.panel.hint.padding.radius};
  ${theme.radius.primaryItem};
`;
