import { ReactNode } from "react";
import styled from "styled-components";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UserBasicInfoFragment } from "~gql";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";
import { fontSize } from "~ui/baseStyles";

interface Props {
  user: UserBasicInfoFragment;
  date: Date;
  children: ReactNode;
}

export const MessageMetaData = ({ user, date, children }: Props) => {
  return (
    <UIHolder>
      <UserAvatar user={user} size="small" />
      <UIHead>
        {getUserOrGuestName(user)} <TimeLabelWithDateTooltip date={date} />
      </UIHead>
      <div />
      {children}
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto minmax(360px, 700px);
  gap: 8px 12px;
`;

const UIHead = styled.div`
  font-weight: bold;
  font-size: ${fontSize.label};
  display: flex;
  gap: 8px;

  ${TimeLabelWithDateTooltip} {
    opacity: 0.4;
    user-select: none;
    font-weight: 400;
  }
`;

function getUserOrGuestName(user: UserBasicInfoFragment): string {
  return user?.name || "Guest";
}
