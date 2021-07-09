import { ReactNode } from "react";
import styled from "styled-components";
import { borderRadius, fontSize } from "~ui/baseStyles";
import { NOTIFICATION_COLOR, STRONG_LINE_COLOR } from "~ui/colors";

interface Props {
  children?: ReactNode;
  className?: string;
  hasNotification: boolean;
}

export const NotificationCount = ({ className, children, hasNotification }: Props) => {
  return (
    <UIHolder hasNotification={hasNotification} className={className}>
      {children}
    </UIHolder>
  );
};

const UIHolder = styled.div<{ hasNotification: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;

  height: 1.25rem;
  min-width: 1.25rem;

  background: ${(props) => (props.hasNotification ? NOTIFICATION_COLOR : STRONG_LINE_COLOR)};

  color: #fff;
  ${borderRadius.label}
  font-size: ${fontSize.label};
  font-weight: bold;
`;
