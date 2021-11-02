import React from "react";
import styled from "styled-components";

import { TopicEventEntity } from "~frontend/clientdb/topicEvent";
import { renderTopicEventBody } from "~frontend/clientdb/topicEventBodyRenderers";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { styledObserver } from "~shared/component";
import { IconAcapelaWave } from "~ui/icons";
import { CircleLabel } from "~ui/icons/CircleLabel";
import { theme } from "~ui/theme";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

interface Props {
  topicEvent: TopicEventEntity;
  className?: string;
}

export const TopicEventFeedItem = styledObserver(function TopicEvent({ topicEvent, className }: Props) {
  const eventBody = renderTopicEventBody(topicEvent);

  if (!eventBody) {
    return null;
  }

  return (
    <UIHolder className={className}>
      <UIHead>
        {topicEvent.actor && <UserAvatar user={topicEvent.actor} size={20} />}
        {!topicEvent.actor && <UIAcapelaCircle label={<IconAcapelaWave />} />}
        <div>{eventBody}</div>
        <UISideTimeLabel date={new Date(topicEvent.created_at)} />
      </UIHead>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  padding-top: 20px;
`;

const UIHead = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.typo.content.secondary};
`;

const UIAcapelaCircle = styled(CircleLabel)<{}>`
  height: 20px;
  width: 20px;
`;
