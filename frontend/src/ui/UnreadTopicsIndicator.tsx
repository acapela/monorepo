import styled from "styled-components";

interface UnreadTopicIndicatorProps {
  unreadMessages: number;
  className?: string;
}

const PureUnreadTopicIndicator = ({ className, unreadMessages }: UnreadTopicIndicatorProps) => {
  if (unreadMessages <= 0) {
    return null;
  }

  return <div className={className}>{unreadMessages > 99 ? "99+" : unreadMessages}</div>;
};

export const UnreadTopicIndicator = styled(PureUnreadTopicIndicator)`
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  padding: 0.25rem 0.5rem;
  background: #f97284;
  color: #fff;
  border-radius: 0.5rem;
`;
