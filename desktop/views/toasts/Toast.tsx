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
import { IconCross } from "@aca/ui/icons";
import { PresenceAnimator, PresenceStyles } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

export interface MetaToastProps {
  disablePositionalAnimations?: boolean;
  pauseAutoHide?: boolean;
  animationsDelay?: number;
}

export interface ToastProps extends MetaToastProps {
  title?: string;
  message: string;
  durationMs?: number;
  id: string;
  isInfinite?: boolean;
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
  isInfinite = false,
  id,
  disablePositionalAnimations,
  animationsDelay = 0,
  action,
  actionObject,
  pauseAutoHide,
  onCloseRequest,
}: ToastProps) {
  function handleCloseRequest() {
    onCloseRequest?.();
    removeToast(id);
  }

  const toastRef = useRef<HTMLDivElement>(null);
  const onCloseRequestRef = useMethod(handleCloseRequest ?? emptyFunction);
  const isHovered = useIsElementOrChildHovered(toastRef);

  const shouldPlayAutoHide = !isInfinite && !pauseAutoHide && !isHovered && !!durationMs;

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

  const hasActions = !!action || !!actionObject;

  return (
    <UIAnimator
      layoutId={disablePositionalAnimations ? undefined : id}
      presenceStyles={getAnimationStyles()}
      transition={{ duration: 0.25, delay: animationsDelay }}
    >
      <UIToast ref={toastRef}>
        {true && (
          <FlyingCloseButton
            onClick={() => {
              handleCloseRequest();
            }}
            size="circle"
            kind="tertiary"
            iconScaleFactor={1.5}
            icon={<IconCross />}
          ></FlyingCloseButton>
        )}
        <UICopy>
          {title && <UITitle>{title}</UITitle>}
          {message && (
            <UIDescriptionHolder>
              <UIDescription $isOnlyContent={!title}>{message}</UIDescription>
            </UIDescriptionHolder>
          )}
        </UICopy>
        {hasActions && (
          <UIActions>
            {action && (
              <Button
                kind="tertiary"
                onClick={() => {
                  action.callback?.();
                }}
              >
                {action.label}
              </Button>
            )}
            {actionObject && <ActionButton action={actionObject.action} target={actionObject.target} kind="tertiary" />}
          </UIActions>
        )}
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

  width: 320px;
  height: fit-content;
  display: flex;
  align-items: center;

  padding: 16px;
  gap: 8px;
`;

const UICopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  word-break: break-word;
  flex-grow: 1;
`;

const UITitle = styled.div`
  ${theme.typo.content.medium};
`;

const UIDescriptionHolder = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const UIDescription = styled.div<{ $isOnlyContent: boolean }>`
  ${theme.typo.secondaryContent.secondary};
  ${theme.common.capLines(5)}
  flex-grow: 1;

  ${(props) => props.$isOnlyContent && theme.typo.content};
`;

const UIActions = styled.div``;

const FlyingCloseButton = styled(IconButton)`
  ${theme.colors.layout.backgroundAccent.withBorder.asBg};

  position: absolute;
  top: 0;
  right: 0;
  margin-top: -12px;
  margin-right: -12px;
`;
