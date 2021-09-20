import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useTopicsQuery } from "~frontend/gql/topics";
import { routes } from "~frontend/router";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { theme } from "~ui/theme";
import { CategoryNameLabel } from "~ui/theme/functional";

import { ToDoItem } from "./ToDoItem";

export const OpenTopics = () => {
  const user = useAssertCurrentUser();

  const [topics] = useTopicsQuery({
    where: {
      owner_id: {
        _eq: user.id,
      },
      closed_at: {
        _is_null: true,
      },
    },
  });

  return (
    <CollapsePanel
      headerNode={<CategoryNameLabel>Your open topics ({topics?.length || 0})</CategoryNameLabel>}
      isInitiallyOpen={false}
      persistanceKey="homeview-open-topics"
    >
      <UITopicsList>
        {topics?.map((topic) => (
          <ToDoItem
            key={topic.id}
            href={
              topic.room
                ? routes.spaceRoomTopic.getUrlWithParams({
                    topicId: topic.id,
                    roomId: topic.room.id,
                    spaceId: topic.room.space.id,
                  })
                : routes.topic.getUrlWithParams({ topicId: topic.id })
            }
          >
            <UITopic>
              {topic.room && `${topic.room.space.name} / ${topic.room.name} / `}
              <UITopicName>{topic.name}</UITopicName>
            </UITopic>
          </ToDoItem>
        ))}
      </UITopicsList>
    </CollapsePanel>
  );
};

const UITopicsList = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
`;

const UITopic = styled.p`
  ${theme.font.body14.build()}
  color: ${theme.colors.layout.supportingText()};
`;

const UITopicName = styled.span`
  ${theme.font.medium.build()};
  color: ${theme.colors.layout.bodyText()};
`;
