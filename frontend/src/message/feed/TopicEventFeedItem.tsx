import React from "react";

import { TopicEventEntity } from "@aca/frontend/clientdb/topicEvent";
import { renderTopicEventBody } from "@aca/frontend/views/RequestView/TopicWithMessages/events/topicEventBodyRenderers";
import { TopicEventTemplate } from "@aca/frontend/views/RequestView/TopicWithMessages/events/TopicEventTemplate";
import { styledObserver } from "@aca/shared/component";

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
    <TopicEventTemplate className={className} date={new Date(topicEvent.created_at)} user={topicEvent.actor}>
      {eventBody}
    </TopicEventTemplate>
  );
})``;
