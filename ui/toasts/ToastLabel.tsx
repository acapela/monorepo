import styled from "styled-components";
import { getObjectKey } from "~shared/object";
import { POP_PRESENCE_STYLES } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { ToastData, ToastType } from "./data";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { theme } from "~ui/theme";
import { ReactNode } from "react";
import { IconAlertCircle, IconAlertTriangle, IconCheckCircle } from "~ui/icons";

interface Props {
  toast: ToastData;
  onCloseRequest: (toast: ToastData) => void;
  className?: string;
}

const toastColors: Record<ToastType, string> = {
  success: theme.colors.status.success(),
  warning: theme.colors.status.warning(),
  error: theme.colors.status.error(),
};

const toastDefaultIcon: Record<ToastType, ReactNode> = {
  success: <IconCheckCircle />,
  warning: <IconAlertTriangle />,
  error: <IconAlertCircle />,
};

export const ToastLabel = styled(function ToastLabel({ toast, onCloseRequest, className }: Props) {
  const { title, description, type, icon } = toast;
  const isDetailed = !!description;
  const iconSize = isDetailed ? "medium" : "small";

  return (
    <UIHolder
      layoutId={getObjectKey(toast)}
      presenceStyles={POP_PRESENCE_STYLES}
      type={type}
      isDetailed={isDetailed}
      className={className}
    >
      {icon && (
        <UIIconHolder isColored={false} type={type} size={iconSize}>
          {icon}
        </UIIconHolder>
      )}
      {!icon && (
        <UIIconHolder isColored={true} type={type} size={iconSize}>
          {toastDefaultIcon[type]}
        </UIIconHolder>
      )}
      <UITitle>{title}</UITitle>
      <CircleCloseIconButton size="small" onClick={() => onCloseRequest(toast)} />
      {isDetailed && (
        <>
          <UIPlaceholder />
          <UIDescription>{description}</UIDescription>
        </>
      )}
    </UIHolder>
  );
})``;

const UIPlaceholder = styled.div<{}>``;

const UIIconHolder = styled.div<{ size: "small" | "medium"; type: ToastType; isColored: boolean }>`
  font-size: ${({ size }) => (size === "small" ? 1.25 : 1.5)}rem;
  color: ${({ type, isColored }) => (isColored ? toastColors[type] : theme.colors.layout.supportingText())};
`;

const UIHolder = styled(PresenceAnimator)<{ isDetailed: boolean; type: ToastType }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: ${({ isDetailed }) => (isDetailed ? "start" : "center")};
  gap: 4px 12px;
  width: 100%;
  padding: 16px ${({ isDetailed }) => (isDetailed ? 12 : 16)}px;
  ${borderRadius.item}
  background: ${theme.colors.layout.foreground()};
  border: 1px solid ${({ type }) => toastColors[type]};
  ${theme.borderRadius.toast};

  ${theme.shadow.popover};
`;

const UITitle = styled.div<{}>`
  ${theme.font.h6.medium.build()}
`;

const UIDescription = styled.div<{}>`
  ${theme.font.body14.build()};
  color: ${theme.colors.layout.supportingText()};
`;
