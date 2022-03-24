import { motion } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { ActionData } from "@aca/desktop/actions/action";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { emptyFunction } from "@aca/shared/functions";
import { useIsElementOrChildHovered } from "@aca/shared/hooks/useIsElementOrChildHovered";
import { useMethod } from "@aca/shared/hooks/useMethod";
import { usePausableTimeout } from "@aca/shared/hooks/usePausableTimeout";
import { DAY } from "@aca/shared/time";
import { Button } from "@aca/ui/buttons/Button";
import { IconInfo } from "@aca/ui/icons";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

interface Props {
  id: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ActionData;
  actionLabel?: {
    label: string;
    callback: () => void;
  };
  target?: unknown;
  onCloseRequest?: () => void;
  autoCloseAfterMs?: number;
  progressPercent?: number;
  pauseAutoHide?: boolean;
}

export function Toast({
  title,
  description,
  action,
  target,
  id,
  onCloseRequest,
  autoCloseAfterMs,
  actionLabel,
  progressPercent,
  icon = <IconInfo />,
  pauseAutoHide,
}: Props) {
  const toastRef = useRef<HTMLDivElement>(null);
  const onCloseRequestRef = useMethod(onCloseRequest ?? emptyFunction);
  const isHovered = useIsElementOrChildHovered(toastRef);

  usePausableTimeout(autoCloseAfterMs ?? DAY, !pauseAutoHide && !isHovered && !!autoCloseAfterMs, () => {
    onCloseRequestRef();
  });

  return (
    <UIAnimator
      layoutId={id}
      presenceStyles={{ opacity: [0, 1], y: [40, 0], scale: [0.7, 1], height: ["0", "auto"] }}
      transition={{ duration: 0.5 }}
    >
      <UIToast
        ref={toastRef}
        onClick={() => {
          onCloseRequest?.();
        }}
      >
        <UIIcon>{icon}</UIIcon>

        <UIBody>
          <UIHead>
            {title && <UITitle>{title}</UITitle>}
            {description && <UIDescription>{description}</UIDescription>}
          </UIHead>
          {progressPercent !== undefined && (
            <UIProgressBar>
              <UIProgressBarIndicator
                animate={{
                  scaleX: progressPercent / 100,
                }}
              />
            </UIProgressBar>
          )}
        </UIBody>
        <UIActions>
          {action && <ActionButton kind="primary" action={action} target={target} />}
          {actionLabel && (
            <Button kind="secondary" onClick={() => actionLabel.callback()}>
              {actionLabel.label}
            </Button>
          )}
        </UIActions>
      </UIToast>
    </UIAnimator>
  );
}

const UIAnimator = styled(PresenceAnimator)`
  will-change: transform, filter;
`;

export const UIToast = styled.div`
  ${theme.colors.layout.backgroundAccent.withBorder.asBg};
  ${theme.box.panel.toast.padding.radius}
  ${theme.shadow.modal};

  margin: 5px 0;

  display: flex;
  align-items: center;
  gap: 16px;
`;

const UIIcon = styled.div`
  font-size: 20px;
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
  justify-content: flex-end;
  align-self: stretch;
  align-items: center;
`;

const UIProgressBar = styled.div`
  height: 4px;
  ${theme.colors.layout.backgroundAccent.hover.asBg};
  border-radius: 2px;
  overflow: hidden;
  width: 100%;
`;
const UIProgressBarIndicator = styled(motion.div)`
  ${theme.colors.primary.asBg};
  height: inherit;
  width: 100%;
  transform-origin: left;
`;
