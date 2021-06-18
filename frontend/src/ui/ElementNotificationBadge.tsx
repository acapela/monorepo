import { ReactNode } from "react";
import styled from "styled-components";
import { fontSize, borderRadius } from "~ui/baseStyles";
import { NOTIFICATION_COLOR } from "~ui/colors";

interface UnreadTopicIndicatorProps {
  children?: ReactNode;
  className?: string;
}

export const ElementNotificationBadge = styled(({ className, children }: UnreadTopicIndicatorProps) => {
  return <UIHolder className={className}>{children}</UIHolder>;
})``;

const UIHolder = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  padding: 4px 8px;
  background: ${NOTIFICATION_COLOR};
  color: #fff;
  ${borderRadius.label}
  font-size: ${fontSize.label};
  font-weight: bold;
`;
