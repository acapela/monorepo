import styled from "styled-components";
import { getObjectKey } from "~shared/object";
import { POP_PRESENCE_STYLES } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { ToastData, ToastType } from "./data";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { theme } from "~ui/theme";

interface Props {
  toast: ToastData;
  onCloseRequest: (toast: ToastData) => void;
  className?: string;
}

const toastColors: Record<ToastType, string> = {
  error: theme.colors.status.error(),
  info: theme.colors.status.warning(),
  success: theme.colors.status.success(),
};

export const ToastLabel = styled(function ToastLabel({ toast, onCloseRequest, className }: Props) {
  return (
    <UIHolder
      layoutId={getObjectKey(toast)}
      presenceStyles={POP_PRESENCE_STYLES}
      type={toast.type}
      isDetailed={!!toast.supportingContent}
      className={className}
    >
      <UIContent>{toast.content}</UIContent>
      <CircleCloseIconButton size="small" onClick={() => onCloseRequest(toast)} />
    </UIHolder>
  );
})``;

const UIHolder = styled(PresenceAnimator)<{ type: ToastType; isDetailed: boolean }>`
  width: 100%;
  padding: 16px ${({ isDetailed }) => (isDetailed ? 12 : 16)}px;
  ${borderRadius.item}
  background: ${theme.colors.layout.foreground()};
  border: 1px solid ${({ type }) => toastColors[type]};
  ${theme.borderRadius.toast};
  display: flex;
  align-items: center;

  ${theme.shadow.popover};
`;

const UIContent = styled.div<{}>`
  ${theme.font.h6.medium.build()}
`;
