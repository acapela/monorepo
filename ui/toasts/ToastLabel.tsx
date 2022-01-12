import { ReactNode } from "react";
import styled from "styled-components";

import { getObjectKey } from "@aca/shared/object";
import { POP_PRESENCE_STYLES } from "@aca/ui/animations";
import { CloseIconButton } from "@aca/ui/buttons/CloseIconButton";
import { IconAlertCircle, IconAlertTriangle, IconCheckCircle } from "@aca/ui/icons";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

import { ToastData, ToastType } from "./data";

interface Props {
  toast: ToastData;
  onCloseRequest: (toast: ToastData) => void;
  className?: string;
}

const toastColors = {
  success: theme.colors.status.success(),
  warning: theme.colors.status.warning(),
  error: theme.colors.status.danger(),
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
      $isDetailed={isDetailed}
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
      <CloseIconButton onClick={() => onCloseRequest(toast)} />
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
  color: ${({ type, isColored }) => (isColored ? toastColors[type] : theme.colors.text)};
`;

const UIHolder = styled(PresenceAnimator)<{ $isDetailed: boolean; type: ToastType }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: ${({ $isDetailed }) => ($isDetailed ? "start" : "center")};
  gap: 4px 12px;
  width: 100%;
  padding: 16px ${({ $isDetailed }) => ($isDetailed ? 12 : 16)}px;
  ${theme.radius.secondaryItem};
  ${theme.colors.primary.withBorder.asBgWithReadableText};
  ${theme.shadow.popover};
`;

const UITitle = styled.div<{}>`
  ${theme.typo.item.title}
`;

const UIDescription = styled.div<{}>`
  ${theme.typo.content};
`;
