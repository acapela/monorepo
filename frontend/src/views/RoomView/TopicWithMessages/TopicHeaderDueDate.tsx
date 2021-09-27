import { gql, useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { isEqual } from "lodash";
import { useEffect } from "react";
import styled from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import {
  FirstTaskInTopic_TaskQuery,
  FirstTaskInTopic_TaskQueryVariables,
  WatchFirstTaskInTopic_TaskSubscription,
  WatchFirstTaskInTopic_TaskSubscriptionVariables,
} from "~gql";
import { relativeFormatDateTime } from "~shared/dates/format";
import { IconFlag } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  topicId: string;
}

const firstTaskInTopicFragment = gql`
  fragment FirstTaskInTopic_task on task {
    id
    created_at
    due_at
    message {
      user_id
    }
  }
`;

const FIRST_TASK_IN_TOPIC_QUERY = gql`
  ${firstTaskInTopicFragment}

  query FirstTaskInTopic_task($topicId: uuid!) {
    task(where: { message: { topic_id: { _eq: $topicId } } }, limit: 1, order_by: { created_at: asc }) {
      ...FirstTaskInTopic_task
    }
  }
`;

// This is used to update the First Task In Topic query after the initial request is created
function useFirstTaskSubscription(topicId: string) {
  const { data } = useSubscription<
    WatchFirstTaskInTopic_TaskSubscription,
    WatchFirstTaskInTopic_TaskSubscriptionVariables
  >(
    gql`
      ${firstTaskInTopicFragment}

      subscription WatchFirstTaskInTopic_task($topicId: uuid!) {
        task(where: { message: { topic_id: { _eq: $topicId } } }, limit: 1, order_by: { created_at: asc }) {
          ...FirstTaskInTopic_task
        }
      }
    `,
    { variables: { topicId } }
  );

  const client = useApolloClient();

  const task = data?.task[0] ?? null;

  useEffect(() => {
    if (!topicId || !task) {
      return;
    }
    const options = {
      query: FIRST_TASK_IN_TOPIC_QUERY,
      variables: { topicId },
    };
    const data = client.readQuery<FirstTaskInTopic_TaskQuery, FirstTaskInTopic_TaskQueryVariables>(options);
    if (!isEqual(task, data?.task[0])) {
      const previousData = data ?? { __typename: "query_root" };
      client.writeQuery<FirstTaskInTopic_TaskQuery, FirstTaskInTopic_TaskQueryVariables>({
        ...options,
        data: {
          ...previousData,
          task: [task],
        },
      });
    }
  }, [client, task, topicId]);

  return;
}

export const TopicHeaderDueDate = function ({ topicId }: Props) {
  const currentUser = useCurrentUser();

  useFirstTaskSubscription(topicId);
  const { data } = useQuery<FirstTaskInTopic_TaskQuery, FirstTaskInTopic_TaskQueryVariables>(
    FIRST_TASK_IN_TOPIC_QUERY,
    { variables: { topicId } }
  );

  const task = data?.task[0] ?? null;

  if (!task) {
    return null;
  }

  const isTaskOwner = task.message.user_id === currentUser?.id;

  const formattedDueDate = task.due_at ? relativeFormatDateTime(new Date(task.due_at as string)) : null;

  return (
    <UIDueDateSection>
      <IconFlag />

      {formattedDueDate && !isTaskOwner && <UIDueDate>{formattedDueDate}</UIDueDate>}
      {formattedDueDate && isTaskOwner && (
        <TaskDueDateSetter taskId={task.id} previousDueDate={task.due_at}>
          <UIDueDate>{formattedDueDate}</UIDueDate>
        </TaskDueDateSetter>
      )}

      {!formattedDueDate && !isTaskOwner && <UIDueDate>No due date</UIDueDate>}
      {!formattedDueDate && isTaskOwner && (
        <TaskDueDateSetter taskId={task.id}>
          <UIDueDate>Add due date</UIDueDate>
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

const UIDueDate = styled.div<{}>`
  ${theme.font.body12.spezia.build()}
`;
