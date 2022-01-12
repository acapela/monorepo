import { ReactNode } from "react";
import styled from "styled-components";

import { UserEntity } from "@aca/frontend/clientdb/user";
import { UserAvatar } from "@aca/frontend/ui/users/UserAvatar";
import { styledObserver } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";
import { TimeLabelWithDateTooltip } from "@aca/ui/time/DateLabel";

interface Props {
  user: UserEntity;
  date: Date;
  children: ReactNode;
  anchorLink?: string;
  className?: string;
  isNextSameUserMessage?: boolean;
  isHovered?: boolean;
}

const AVATAR_SIZE = 30;

export const MessageMetaDataWrapper = styledObserver(
  ({ user, date, children, isNextSameUserMessage = false, isHovered = false, anchorLink, className }: Props) => {
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
              <OptionalAnchorLink anchor={anchorLink}>
                <UIHeaderTimeLabel date={date} />
              </OptionalAnchorLink>
            </UIHead>
          )}
          {isHovered && isNextSameUserMessage && (
            <OptionalAnchorLink anchor={anchorLink}>
              <UISideTimeLabel date={date} />
            </OptionalAnchorLink>
          )}
          {children}
        </UIMessageBody>
      </UIHolder>
    );
  }
)``;

const OptionalAnchorLink = ({ children, anchor }: { children: ReactNode; anchor?: string }) => {
  return (
    <>
      {anchor && <a href={anchor}>{children}</a>}
      {!anchor && children}
    </>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  ${theme.spacing.actions.asGap};
`;

const UIMessageSideInfo = styled.div`
  min-width: ${AVATAR_SIZE}px;
`;

const UIMessageBody = styled.div`
  position: relative;
  flex-grow: 1;
  min-width: 0;
`;

const UIHead = styled.div<{}>`
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;

  ${theme.spacing.actions.asGap};
`;

const UIHeaderTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  opacity: 0.4;
  user-select: none;
`;

const UIAuthorName = styled.div`
  ${theme.typo.content.semibold}
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.typo.content.secondary};
  position: absolute;
  right: 100%;
  top: 0;
  user-select: none;
  margin-right: 5px;
`;
