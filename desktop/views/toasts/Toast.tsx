import React, { useRef } from "react";
import styled from "styled-components";

import { ActionData } from "@aca/desktop/actions/action";
import { removeToast } from "@aca/desktop/domains/toasts/store";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { emptyFunction } from "@aca/shared/functions";
import { useIsElementOrChildHovered } from "@aca/shared/hooks/useIsElementOrChildHovered";
import { useMethod } from "@aca/shared/hooks/useMethod";
import { usePausableTimeout } from "@aca/shared/hooks/usePausableTimeout";
import { DAY } from "@aca/shared/time";
import { Button } from "@aca/ui/buttons/Button";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconCross, IconInfo } from "@aca/ui/icons";
import { PresenceAnimator, PresenceStyles } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

export interface MetaToastProps {
  disablePositionalAnimations?: boolean;
  pauseAutoHide?: boolean;
  animationsDelay?: number;
}

export interface ToastProps extends MetaToastProps {
  title: string;
  message: string;
  durationMs?: number;
  id: string;
  onCloseRequest?: () => void;
  action?: {
    label: string;
    callback?: () => void;
  };
  actionObject?: {
    action: ActionData;
    target?: unknown;
  };
}

export function Toast({
  title,
  message,
  durationMs,
  id,
  disablePositionalAnimations,
  animationsDelay = 0,
  action,
  actionObject,
  pauseAutoHide,
}: ToastProps) {
  function onCloseRequest() {
    removeToast(id);
  }

  // title = undefined;

  const toastRef = useRef<HTMLDivElement>(null);
  const onCloseRequestRef = useMethod(onCloseRequest ?? emptyFunction);
  const isHovered = useIsElementOrChildHovered(toastRef);

  const shouldPlayAutoHide = !pauseAutoHide && !isHovered && !!durationMs;

  usePausableTimeout(durationMs ?? DAY, shouldPlayAutoHide, () => {
    onCloseRequestRef();
  });

  function getAnimationStyles(): PresenceStyles {
    if (disablePositionalAnimations) {
      return {
        opacity: [0, 1],
      };
    }

    return {
      opacity: [0, 1],
      y: [40, 0],
      scale: [0.7, 1],
      height: ["0", "auto"],
    };
  }

  return (
    <UIAnimator
      layoutId={disablePositionalAnimations ? undefined : id}
      presenceStyles={getAnimationStyles()}
      transition={{ duration: 0.25, delay: animationsDelay }}
    >
      <UIToast
        ref={toastRef}
        onClick={() => {
          onCloseRequest?.();
        }}
      >
        <UIIcon>
          <IconInfo />
        </UIIcon>

        <UIBody>
          <UICloseFlyer size="compact" kind="transparent" icon={<IconCross />}></UICloseFlyer>
          <UIHead>
            {title && <UITitle>{title}</UITitle>}
            {message && <UIDescription>{message}</UIDescription>}
          </UIHead>
          <UIActions>
            {action && (
              <Button
                kind="secondary"
                onClick={() => {
                  action.callback?.();
                }}
              >
                {action.label}
              </Button>
            )}
            {actionObject && (
              <ActionButton action={actionObject.action} target={actionObject.target} kind="secondary" />
            )}
          </UIActions>
        </UIBody>
      </UIToast>
    </UIAnimator>
  );
}

const UIAnimator = styled(PresenceAnimator)`
  will-change: transform, filter;
`;

const UIToast = styled.div`
  ${theme.colors.layout.backgroundAccent.withBorder.asBg};
  ${theme.box.panel.toast.padding.radius}
  ${theme.shadow.modal};

  margin: 5px 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 28px;
  gap: 16px;
`;

const UIIcon = styled.div`
  font-size: 20px;
  margin-top: 4px;
`;

const UIBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex-grow: 1;
`;

const UIHead = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  word-break: break-word;
  flex-grow: 1;
`;

const UITitle = styled.div`
  ${theme.typo.content.medium}
`;
const UIDescription = styled.div`
  ${theme.typo.content.secondary};
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
`;

const UIActions = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
`;

const UICloseFlyer = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 0;
`;
