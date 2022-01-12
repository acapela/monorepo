import React, { ReactNode } from "react";
import styled from "styled-components";

import { UserEntity } from "@aca/frontend/clientdb/user";
import { UserAvatar } from "@aca/frontend/ui/users/UserAvatar";
import { AcapelaAvatar } from "@aca/frontend/utils/AcapelaAvatar";
import { styledObserver } from "@aca/shared/component";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { theme } from "@aca/ui/theme";
import { TimeLabelWithDateTooltip } from "@aca/ui/time/DateLabel";

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
