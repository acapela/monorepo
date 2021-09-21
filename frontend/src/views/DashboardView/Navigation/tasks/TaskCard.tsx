import gql from "graphql-tag";
import styled from "styled-components";

import { DashboardTaskCard_TaskFragment } from "~frontend/../../gql";
import { theme } from "~frontend/../../ui/theme";
import { withFragments } from "~frontend/gql/utils";

const fragments = {
  task: gql`
    fragment DashboardTaskCard_task on task {
      id
      user_id
      message {
        id
        content
        user_id
        topic {
          id
          name
        }
      }
      created_at
    }
  `,
};

interface Props {
  task: DashboardTaskCard_TaskFragment;
}

export const DashboardTaskCard = withFragments(fragments, function DashboardTaskCard({ task }: Props) {
  const topicTitle = task.message.topic.name;
  return (
    <UIHolder>
      <UITitle>{topicTitle}</UITitle>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  background-color: ${theme.colors.layout.foreground()};
  ${theme.borderRadius.item};
  padding: 12px 16px;
`;

const UITitle = styled.h4``;
