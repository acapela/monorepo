import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useTopicsQuery } from "~frontend/gql/topics";
import { routes } from "~frontend/router";
import { fillParamsInUrl } from "~frontend/router/utils";
import { theme } from "~ui/theme";

import { ToDoItem } from "./ToDoItem";
import { ToDoSection } from "./ToDoSection";

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
    <ToDoSection title={`Your open topics (${topics?.length || 0})`}>
      {topics?.map((topic) => (
        <ToDoItem
          key={topic.id}
          href={fillParamsInUrl(routes.spaceRoomTopic.path, {
            topicId: topic.id,
            roomId: topic.room.id,
            spaceId: topic.room.space.id,
          })}
        >
          <UITopic>
            {topic.room.space.name} / {topic.room.name} / <UITopicName>{topic.name}</UITopicName>
          </UITopic>
        </ToDoItem>
      ))}
    </ToDoSection>
  );
};

const UITopic = styled.p`
  ${theme.font.body14.build()}
  color: ${theme.colors.layout.supportingText()};
`;

const UITopicName = styled.span`
  ${theme.font.medium.build()};
  color: ${theme.colors.layout.bodyText()};
`;
