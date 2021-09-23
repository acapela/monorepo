import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";

import { FirstTaskInTopic_TaskQuery, FirstTaskInTopic_TaskQueryVariables } from "~gql";
import { relativeFormatDateTime } from "~shared/dates/format";
import { IconFlag } from "~ui/icons";
import { theme } from "~ui/theme";

const firstTaskInTopicFragment = gql`
  fragment FirstTaskInTopic_task on task {
    id
    created_at
    due_at
  }
`;

interface Props {
  topicId: string;
}

export const TopicHeaderDueDate = function ({ topicId }: Props) {
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
    return <div></div>;
  }

  return (
    <UIDueDateSection data-tooltip={`Due date`}>
      <IconFlag />
      {task.due_at && <UIDueDate>{relativeFormatDateTime(new Date(task.due_at as string))}</UIDueDate>}
      {!task.due_at && <UIDueDate>Add due date</UIDueDate>}
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
`;

const UIDueDate = styled.div<{}>`
  ${theme.font.body12.spezia.build()}
`;
