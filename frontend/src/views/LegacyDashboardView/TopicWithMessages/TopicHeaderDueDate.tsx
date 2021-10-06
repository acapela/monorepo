import { gql, useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { isEqual } from "lodash";
import { useEffect } from "react";
import styled, { css } from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import {
  TasksInFirstTopicMessage_MessageQuery,
  TasksInFirstTopicMessage_MessageQueryVariables,
  WatchTasksInFirstTopicMessage_MessageSubscription,
  WatchTasksInFirstTopicMessage_MessageSubscriptionVariables,
} from "~gql";
import { relativeFormatDateTime } from "~shared/dates/format";
import { IconFlag } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  topicId: string;
}

const tasksInFirstTopicMessageFragment = gql`
  fragment TasksInFirstTopicMessage_message on message {
    id
    user_id
    tasks {
      id
      created_at
      due_at
    }
  }
`;

const TASKS_IN_FIRST_TOPIC_MESSAGE_QUERY = gql`
  ${tasksInFirstTopicMessageFragment}

  query TasksInFirstTopicMessage_message($topicId: uuid!) {
    message(where: { topic_id: { _eq: $topicId } }, limit: 1, order_by: { created_at: asc }) {
      ...TasksInFirstTopicMessage_message
    }
  }
`;

// This is used to update the First Task In Topic query after the initial request is created
function useFirstTaskSubscription(topicId: string) {
  const { data } = useSubscription<
    WatchTasksInFirstTopicMessage_MessageSubscription,
    WatchTasksInFirstTopicMessage_MessageSubscriptionVariables
  >(
    gql`
      ${tasksInFirstTopicMessageFragment}

      subscription WatchTasksInFirstTopicMessage_message($topicId: uuid!) {
        message(where: { topic_id: { _eq: $topicId } }, limit: 1, order_by: { created_at: asc }) {
          ...TasksInFirstTopicMessage_message
        }
      }
    `,
    { variables: { topicId } }
  );

  const client = useApolloClient();

  const message = data?.message[0] ?? null;

  useEffect(() => {
    if (!topicId || !message) {
      return;
    }
    const options = {
      query: TASKS_IN_FIRST_TOPIC_MESSAGE_QUERY,
      variables: { topicId },
    };
    const data = client.readQuery<
      TasksInFirstTopicMessage_MessageQuery,
      TasksInFirstTopicMessage_MessageQueryVariables
    >(options);
    if (!isEqual(message, data?.message[0])) {
      const previousData = data ?? { __typename: "query_root" };
      client.writeQuery<TasksInFirstTopicMessage_MessageQuery, TasksInFirstTopicMessage_MessageQueryVariables>({
        ...options,
        data: {
          ...previousData,
          message: [message],
        },
      });
    }
  }, [client, message, topicId]);

  return;
}

export const TopicHeaderDueDate = function ({ topicId }: Props) {
  const currentUser = useCurrentUser();

  useFirstTaskSubscription(topicId);
  const { data } = useQuery<TasksInFirstTopicMessage_MessageQuery, TasksInFirstTopicMessage_MessageQueryVariables>(
    TASKS_IN_FIRST_TOPIC_MESSAGE_QUERY,
    { variables: { topicId } }
  );

  const message = data?.message[0] ?? null;

  if (message === null || message.tasks.length === 0) {
    return null;
  }

  const isTaskOwner = message.user_id === currentUser?.id;
  const previousDueDate = message.tasks[0].due_at;
  const formattedDueDate = previousDueDate ? relativeFormatDateTime(new Date(previousDueDate as string)) : null;

  return (
    <UIDueDateSection>
      <IconFlag />

      {formattedDueDate && !isTaskOwner && <UIDueDate>{formattedDueDate}</UIDueDate>}
      {formattedDueDate && isTaskOwner && (
        <TaskDueDateSetter messageId={message.id} previousDueDate={previousDueDate}>
          <UIDueDate isClickable>{formattedDueDate}</UIDueDate>
        </TaskDueDateSetter>
      )}

      {!formattedDueDate && !isTaskOwner && <UIDueDate>No due date</UIDueDate>}
      {!formattedDueDate && isTaskOwner && (
        <TaskDueDateSetter messageId={message.id}>
          <UIDueDate isClickable>Add due date</UIDueDate>
        </TaskDueDateSetter>
      )}
    </UIDueDateSection>
  );
};

const UIDueDateSection = styled.div<{}>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;

  svg {
    color: ${theme.colors.status.warning()};
  }

  cursor: default;
`;

const UIDueDate = styled.div<{ isClickable?: boolean }>`
  ${theme.font.body12.spezia.build()}

  ${(props) =>
    props.isClickable &&
    css`
      white-space: nowrap;
      cursor: pointer;
      text-decoration: underline;
    `}
`;
