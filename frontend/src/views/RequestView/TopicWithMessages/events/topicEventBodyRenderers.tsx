import { formatRelative } from "date-fns";
import { upperFirst } from "lodash";
import { ReactNode } from "react";
import styled from "styled-components";

import { TopicEventEntity } from "@aca/frontend/clientdb/topicEvent";
import { theme } from "@aca/ui/theme";

interface TopicEventRenderer {
  isMatch(event: TopicEventEntity): boolean;
  render(event: TopicEventEntity): ReactNode;
}

const UserClosedTopicEvent: TopicEventRenderer = {
  isMatch({ actor_id, topic_from_closed_at, topic_to_closed_at }: TopicEventEntity) {
    return actor_id !== null && topic_from_closed_at === null && topic_to_closed_at !== null;
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
  isMatch({ actor_id, topic_from_closed_at, topic_to_closed_at }: TopicEventEntity) {
    return actor_id === null && topic_from_closed_at === null && topic_to_closed_at !== null;
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
  isMatch({ topic_from_closed_at, topic_to_closed_at }: TopicEventEntity) {
    return topic_from_closed_at !== null && topic_to_closed_at === null;
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
  isMatch({ topic_from_archived_at, topic_to_archived_at }: TopicEventEntity) {
    return topic_from_archived_at === null && topic_to_archived_at !== null;
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
  isMatch({ topic_from_archived_at, topic_to_archived_at }: TopicEventEntity) {
    return topic_from_archived_at !== null && topic_to_archived_at === null;
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
  isMatch({ topic_from_name, topic_to_name }: TopicEventEntity) {
    return topic_from_name !== null && topic_to_name !== null;
  },
  render({ actor, topic_from_name, topic_to_name }: TopicEventEntity): ReactNode {
    return (
      <>
        <UIBold>{actor?.name}</UIBold> renamed <UIBold>{topic_from_name}</UIBold> to <UIBold>{topic_to_name}</UIBold>{" "}
      </>
    );
  },
};

const AddedDueDateTopicEvent: TopicEventRenderer = {
  isMatch({
    message_task_due_date_message_id,
    message_task_due_date_from_due_at,
    message_task_due_date_to_due_at,
  }: TopicEventEntity) {
    return (
      message_task_due_date_message_id !== null &&
      message_task_due_date_from_due_at === null &&
      message_task_due_date_to_due_at !== null
    );
  },
  render({ actor, message_task_due_date_to_due_at, message }: TopicEventEntity): ReactNode {
    if (!message) {
      return null;
    }

    return (
      <>
        <UIBold>{actor?.name}</UIBold> changed{" "}
        <UIAnchorLink href={`#${message.id}`}>{message.user.name}'s request</UIAnchorLink> due date to{" "}
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <UIBold>{upperFirst(formatRelative(new Date(message_task_due_date_to_due_at!), new Date()))}</UIBold>
      </>
    );
  },
};

const ChangedDueDateTopicEvent: TopicEventRenderer = {
  isMatch({
    message_task_due_date_message_id,
    message_task_due_date_from_due_at,
    message_task_due_date_to_due_at,
  }: TopicEventEntity) {
    return (
      message_task_due_date_message_id !== null &&
      message_task_due_date_from_due_at !== null &&
      message_task_due_date_to_due_at !== null
    );
  },
  render(topicEvent: TopicEventEntity): ReactNode {
    const { actor, message_task_due_date_from_due_at, message_task_due_date_to_due_at, message } = topicEvent;
    if (!message) {
      return null;
    }

    return (
      <>
        <UIBold>{actor?.name}</UIBold> changed{" "}
        <UIAnchorLink href={`#${message.id}`}>{message.user.name}'s request</UIAnchorLink> due date from{" "}
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <UIBold>{upperFirst(formatRelative(new Date(message_task_due_date_from_due_at!), new Date()))}</UIBold> to{" "}
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <UIBold>{upperFirst(formatRelative(new Date(message_task_due_date_to_due_at!), new Date()))}</UIBold>
      </>
    );
  },
};

const RemoveDueDateTopicEvent: TopicEventRenderer = {
  isMatch({
    message_task_due_date_message_id,
    message_task_due_date_from_due_at,
    message_task_due_date_to_due_at,
  }: TopicEventEntity) {
    return (
      message_task_due_date_message_id !== null &&
      message_task_due_date_from_due_at !== null &&
      message_task_due_date_to_due_at === null
    );
  },
  render(topicEvent: TopicEventEntity): ReactNode {
    const { actor, message } = topicEvent;
    if (!message) {
      return null;
    }

    return (
      <>
        <UIBold>{actor?.name}</UIBold> removed{" "}
        <UIAnchorLink href={`#${message.id}`}>{message.user.name}'s request</UIAnchorLink> due date
      </>
    );
  },
};

const ChangedPriorityTopicEvent: TopicEventRenderer = {
  isMatch: ({ topic_from_priority, topic_to_priority }) => Boolean(topic_from_priority || topic_to_priority),
  render: ({ actor, topic_to_priority: priority }) => (
    <>
      <UIBold>{actor?.name}</UIBold>{" "}
      {priority ? (
        <>
          changed priority to <UIBold>{priority}</UIBold>
        </>
      ) : (
        <>removed priority</>
      )}
    </>
  ),
};

const topicEventRenderers = {
  UserClosedTopicEvent,
  AutomaticClosedTopicEvent,
  ReopenedTopicEvent,

  ArchivedTopicEvent,
  UnarchivedTopicEvent,

  RenamedTopicEvent,

  AddedDueDateTopicEvent,
  ChangedDueDateTopicEvent,
  RemoveDueDateTopicEvent,

  ChangedPriorityTopicEvent,
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

const UIAnchorLink = styled.a<{}>`
  ${theme.typo.content.medium};
  text-decoration: underline;
  opacity: 0.8;
`;
