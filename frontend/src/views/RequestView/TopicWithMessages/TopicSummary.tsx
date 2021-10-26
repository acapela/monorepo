import React from "react";
import styled from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { styledObserver } from "~shared/component";
import { CircleLabel } from "~ui/icons/CircleLabel";
import { theme } from "~ui/theme";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

type Props = {
  topic: TopicEntity;
  className?: string;
};

// Temporary, to be deleted
export const TopicSummaryMessage = styledObserver<Props>(({ topic, className }) => {
  const { closedByUser, closed_at } = topic;

  if (!topic.isClosed) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const closedAtDate = new Date(closed_at!);

  if (!closedByUser) {
    return (
      <UIHolder className={className}>
        <UIHead>
          <UICheckCircle label={<>✔</>} />
          <UIHead>Hurray! The request has been completed by everyone and has been Closed</UIHead>
          <UISideTimeLabel date={closedAtDate} />
        </UIHead>
      </UIHolder>
    );
  }

  return (
    <UIHolder className={className}>
      <UIHead>
        <UserAvatar user={closedByUser} size={20} />
        <div>Closed the request</div>
        <UISideTimeLabel date={closedAtDate} />
      </UIHead>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  padding: 20px 0;
`;

const UIHead = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap}
  ${theme.font.semibold}
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.typo.content.secondary};
`;

const UICheckCircle = styled(CircleLabel)<{}>`
  height: 20px;
  width: 20px;
`;
