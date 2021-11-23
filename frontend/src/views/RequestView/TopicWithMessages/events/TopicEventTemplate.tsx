import React, { ReactNode } from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { AcapelaAvatar } from "~frontend/utils/AcapelaAvatar";
import { styledObserver } from "~shared/component";
import { FadePresenceAnimator } from "~ui/animations";
import { theme } from "~ui/theme";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

interface Props {
  user?: UserEntity | null;
  children: string | ReactNode;
  date?: Date;
  className?: string;
}

export const TopicEventTemplate = styledObserver(function TopicEvent({ user, children, date, className }: Props) {
  return (
    <UIHolder className={className}>
      {user && <UserAvatar user={user} size={20} />}
      {!user && <UIAcapelaAvatar />}
      <UIBody>{children}</UIBody>
      {date && <UISideTimeLabel date={date} />}
    </UIHolder>
  );
})``;

const UIHolder = styled(FadePresenceAnimator)<{}>`
  margin-top: 20px;
  padding: 0 5px;

  display: flex;
  flex-direction: row;
  align-items: flex-start;

  gap: 15px;
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.typo.content.secondary.readingLineHeight};
`;

const UIBody = styled.div<{}>`
  ${theme.font.readingLineHeight};
`;

const UIAcapelaAvatar = styled(AcapelaAvatar)`
  font-size: 20px;
`;
