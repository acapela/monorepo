import React from "react";

import { TopicEventEntity } from "~frontend/clientdb/topicEvent";
import { styledObserver } from "~shared/component";

import { renderTopicEventBody } from "./TopicEventBodyRenderers";
import { TopicEventTemplate } from "./TopicEventTemplate";

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
