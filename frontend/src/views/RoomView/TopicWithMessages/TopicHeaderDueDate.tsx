import { gql, useQuery } from "@apollo/client";
import styled, { css } from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { FirstTaskInTopic_TaskQuery, FirstTaskInTopic_TaskQueryVariables } from "~gql";
import { relativeFormatDateTime } from "~shared/dates/format";
import { IconFlag } from "~ui/icons";
import { theme } from "~ui/theme";

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

interface Props {
  topicId: string;
}

export const TopicHeaderDueDate = function ({ topicId }: Props) {
  const currentUser = useCurrentUser();

  const result = useQuery<FirstTaskInTopic_TaskQuery, FirstTaskInTopic_TaskQueryVariables>(
    gql`
      ${firstTaskInTopicFragment}

      query FirstTaskInTopic_task($topicId: uuid!) {
        task(where: { message: { topic_id: { _eq: $topicId } } }, limit: 1, order_by: { created_at: asc }) {
          ...FirstTaskInTopic_task
        }
      }
    `,
    { variables: { topicId } }
  );

  const task = result.data?.task[0] ?? null;

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
          <UIDueDate isClickable>{formattedDueDate}</UIDueDate>
        </TaskDueDateSetter>
      )}

      {!formattedDueDate && !isTaskOwner && <UIDueDate>No due date</UIDueDate>}
      {!formattedDueDate && isTaskOwner && (
        <TaskDueDateSetter taskId={task.id}>
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
