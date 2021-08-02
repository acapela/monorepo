import styled from "styled-components";
import { getObjectKey } from "~shared/object";
import { POP_PRESENCE_STYLES } from "~ui/animations";
import { borderRadius, shadow } from "~ui/baseStyles";
import { ACTIVE_COLOR, DANGER_COLOR, SUCCESS_COLOR } from "~ui/theme/colors/base";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { ToastData, ToastType } from "./data";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";

interface Props {
  toast: ToastData;
  onCloseRequest: (toast: ToastData) => void;
  className?: string;
}

function getToastColor(type: ToastType) {
  switch (type) {
    case "error":
      return DANGER_COLOR;
    case "info":
      return ACTIVE_COLOR;
    case "success":
      return SUCCESS_COLOR;
  }

  throw new Error("Incorrect toast type");
}

export const ToastLabel = styled(function ToastLabel({ toast, onCloseRequest, className }: Props) {
  return (
    <UIHolder
      layoutId={getObjectKey(toast)}
      presenceStyles={POP_PRESENCE_STYLES}
      type={toast.type}
      className={className}
    >
      <UIContent>{toast.content}</UIContent>
      <CircleCloseIconButton size="small" onClick={() => onCloseRequest(toast)} />
    </UIHolder>
  );
})``;

const UIHolder = styled(PresenceAnimator)<{ type: ToastType }>`
  width: 100%;
  padding: 16px 24px;
  ${borderRadius.item}
  background: ${(props) => getToastColor(props.type)};
  color: #fff;
  font-weight: bold;
  border: 1px solid #f8f8f8;
  display: flex;
  align-items: center;

  ${shadow.modal};
`;

const UIContent = styled.div`
  margin-right: 24px;
  flex: 1;
  text-align: center;
`;
