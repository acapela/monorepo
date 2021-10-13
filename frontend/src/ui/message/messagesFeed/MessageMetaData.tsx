import { ReactNode } from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { styledObserver } from "~shared/component";
import { theme } from "~ui/theme";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

interface Props {
  user: UserEntity;
  date: Date;
  children: ReactNode;
  className?: string;
  isNextSameUserMessage?: boolean;
  isHovered?: boolean;
}

const AVATAR_SIZE = 30;

export const MessageMetaDataWrapper = styledObserver(
  ({ user, date, children, isNextSameUserMessage = false, isHovered = false, className }: Props) => {
    return (
      <UIHolder className={className}>
        <UIMessageSideInfo>
          {!isNextSameUserMessage && (
            <>
              <UserAvatar user={user} size={AVATAR_SIZE} />{" "}
            </>
          )}
        </UIMessageSideInfo>
        <UIMessageBody>
          {!isNextSameUserMessage && (
            <UIHead>
              <UIAuthorName>{user.name || "Guest"}</UIAuthorName>
              <UIHeaderTimeLabel date={date} />
            </UIHead>
          )}
          {isHovered && <UISideTimeLabel date={date} />}
          {children}
        </UIMessageBody>
      </UIHolder>
    );
  }
)``;

const UIHolder = styled.div<{}>`
  display: flex;
  ${theme.spacing.horizontalActions.asGap};
`;

const UIMessageSideInfo = styled.div`
  min-width: ${AVATAR_SIZE}px;
`;

const UIMessageBody = styled.div``;

const UIAuthorInfo = styled.div``;

const UIHead = styled.div<{}>`
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;

  ${theme.spacing.horizontalActions.asGap};
`;

const UIHeaderTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  opacity: 0.4;
  user-select: none;
`;

const UIAuthorName = styled.div`
  ${theme.typo.content.semibold}
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.typo.label};
  opacity: 0.4;
  user-select: none;
`;
