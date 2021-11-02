import { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

import { TopicEventEntity } from "./topicEvent";

interface TopicEventRenderer {
  isMatch(event: TopicEventEntity): boolean;
  render(event?: TopicEventEntity): ReactNode;
}

const UserClosedTopicEvent: TopicEventRenderer = {
  isMatch({ actor_id, topic_event_topic }: TopicEventEntity) {
    return actor_id !== null && topic_event_topic.from_closed_at === null && topic_event_topic.to_closed_at !== null;
  },
  render(event: TopicEventEntity) {
    return (
      <>
        <UIBold>{event.actor?.name}</UIBold> closed the request
      </>
    );
  },
};

const AutomaticClosedTopicEvent: TopicEventRenderer = {
  isMatch({ actor_id, topic_event_topic }: TopicEventEntity) {
    return actor_id === null && topic_event_topic.from_closed_at === null && topic_event_topic.to_closed_at !== null;
  },
  render(event: TopicEventEntity) {
    return (
      <>
        Hurray! <UIBold>{event.topic?.name ?? "This Request"}</UIBold> has been completed by everyone and has been{" "}
        <UIBold>Closed</UIBold>.
      </>
    );
  },
};

const ReopenedTopicEvent: TopicEventRenderer = {
  isMatch({ topic_event_topic }: TopicEventEntity) {
    return topic_event_topic.from_closed_at !== null && topic_event_topic.to_closed_at === null;
  },
  render(event: TopicEventEntity) {
    return (
      <>
        <UIBold>{event.actor?.name}</UIBold> reopened the request
      </>
    );
  },
};

const ArchivedTopicEvent: TopicEventRenderer = {
  isMatch({ topic_event_topic }: TopicEventEntity) {
    return topic_event_topic.from_archived_at === null && topic_event_topic.to_archived_at !== null;
  },
  render(event: TopicEventEntity) {
    return (
      <>
        <UIBold>{event.actor?.name}</UIBold> archived the request
      </>
    );
  },
};

const UnarchivedTopicEvent: TopicEventRenderer = {
  isMatch({ topic_event_topic }: TopicEventEntity) {
    return topic_event_topic.from_archived_at !== null && topic_event_topic.to_archived_at === null;
  },
  render(event: TopicEventEntity) {
    return (
      <>
        <UIBold>{event.actor?.name}</UIBold> unarchived the request
      </>
    );
  },
};

const RenamedTopicEvent: TopicEventRenderer = {
  isMatch({ topic_event_topic }: TopicEventEntity) {
    return topic_event_topic.from_name !== null && topic_event_topic.to_name !== null;
  },
  render({ actor, topic_event_topic }: TopicEventEntity): ReactNode {
    const { from_name, to_name } = topic_event_topic;
    return (
      <>
        <UIBold>{actor?.name}</UIBold> renamed request from <UIBold>{from_name}</UIBold> to <UIBold>{to_name}</UIBold>{" "}
      </>
    );
  },
};

const topicEventRenderers = {
  UserClosedTopicEvent,
  AutomaticClosedTopicEvent,
  ReopenedTopicEvent,
  ArchivedTopicEvent,
  UnarchivedTopicEvent,
  RenamedTopicEvent,
} as const;

export function renderTopicEventBody(topicEvent: TopicEventEntity): ReactNode | null {
  for (const renderer of Object.values(topicEventRenderers)) {
    if (renderer.isMatch(topicEvent)) {
      return renderer.render(topicEvent);
    }
  }

  return null;
}

const UIBold = styled.span<{}>`
  ${theme.font.semibold}
`;
