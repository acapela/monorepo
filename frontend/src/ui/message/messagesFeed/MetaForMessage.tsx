import { ReactNode } from "react";
import styled from "styled-components";
import { niceFormatDate } from "~shared/dates/format";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UserBasicInfoFragment } from "~gql";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

interface Props {
  user: UserBasicInfoFragment;
  date: Date;
  children: ReactNode;
}

export const MetaForMessage = ({ user, date, children }: Props) => {
  return (
    <UIHolder>
      <MessageAvatar user={user} size="small" />
      <UIBody data-tooltip={niceFormatDate(date)}>
        <UIHead>
          {getUserOrGuestName(user)} <TimeLabelWithDateTooltip date={date} />
        </UIHead>
        {children}
      </UIBody>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
`;

const MessageAvatar = styled(UserAvatar)`
  flex-shrink: 0;
`;

const UIHead = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
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

const UIBody = styled.div`
  min-width: 360px;
  max-width: 700px;
`;
