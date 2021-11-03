import React, { ReactNode } from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { styledObserver } from "~shared/component";
import { IconAcapelaWave } from "~ui/icons";
import { CircleLabel } from "~ui/icons/CircleLabel";
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
      {!user && <UIAcapelaCircle label={<IconAcapelaWave />} />}
      <UIBody>{children}</UIBody>
      {date && <UISideTimeLabel date={date} />}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  margin-top: 20px;
  padding: 0 5px;

  display: flex;
  flex-direction: row;
  align-items: flex-start;

  gap: 15px;
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.typo.content.secondary};
  line-height: 20px;
`;

const UIBody = styled.div<{}>`
  line-height: 20px;
`;

const UIAcapelaCircle = styled(CircleLabel)<{}>`
  height: 20px;
  width: 20px;
  font-size: 20px;
`;
