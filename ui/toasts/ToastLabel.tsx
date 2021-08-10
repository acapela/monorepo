import styled from "styled-components";
import { getObjectKey } from "~shared/object";
import { POP_PRESENCE_STYLES } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { ToastData, ToastType } from "./data";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { theme } from "~ui/theme";
import { ReactNode } from "react";
import { IconAlertCircle, IconCheckCircle } from "~ui/icons";

interface Props {
  toast: ToastData;
  onCloseRequest: (toast: ToastData) => void;
  className?: string;
}

const toastColors: Record<ToastType, string> = {
  success: theme.colors.status.success(),
  error: theme.colors.status.error(),
};

const toastDefaultIcon: Record<ToastType, ReactNode> = {
  success: <IconCheckCircle />,
  error: <IconAlertCircle />,
};

export const ToastLabel = styled(function ToastLabel({ toast, onCloseRequest, className }: Props) {
  const { content, supportingContent, type, icon } = toast;
  const isDetailed = !!supportingContent;
  const color = toastColors[type];

  return (
    <UIHolder
      layoutId={getObjectKey(toast)}
      presenceStyles={POP_PRESENCE_STYLES}
      color={color}
      isDetailed={isDetailed}
      className={className}
    >
      <UIIconHolder
        color={isDetailed ? theme.colors.layout.supportingText() : color}
        size={isDetailed ? "medium" : "small"}
      >
        {icon || toastDefaultIcon[type]}
      </UIIconHolder>
      <UIContent>{content}</UIContent>
      <CircleCloseIconButton size="small" onClick={() => onCloseRequest(toast)} />
      {isDetailed && (
        <>
          <div />
          <UISupportingContent>{supportingContent}</UISupportingContent>
        </>
      )}
    </UIHolder>
  );
})``;

const UIIconHolder = styled.div<{ size: "small" | "medium"; color: string }>`
  font-size: ${({ size }) => (size === "small" ? 1.25 : 1.5)}rem;
  color: ${({ color }) => color};
`;

const UIHolder = styled(PresenceAnimator)<{ isDetailed: boolean; color: string }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: ${({ isDetailed }) => (isDetailed ? "start" : "center")};
  gap: 4px 12px;
  width: 100%;
  padding: 16px ${({ isDetailed }) => (isDetailed ? 12 : 16)}px;
  ${borderRadius.item}
  background: ${theme.colors.layout.foreground()};
  border: 1px solid ${({ color }) => color};
  ${theme.borderRadius.toast};

  ${theme.shadow.popover};
`;

const UIContent = styled.div<{}>`
  ${theme.font.h6.medium.build()}
`;

const UISupportingContent = styled.div<{}>`
  ${theme.font.body14.build()};
  color: ${theme.colors.layout.supportingText()};
`;
