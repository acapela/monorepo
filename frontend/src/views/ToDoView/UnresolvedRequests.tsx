import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useTasksQuery } from "~frontend/gql/tasks";
import { routes } from "~frontend/router";
import { fillParamsInUrl } from "~frontend/router/utils";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { theme } from "~ui/theme";

import { ToDoItem } from "./ToDoItem";
import { ToDoSection } from "./ToDoSection";

export const UnresolvedRequests = () => {
  const user = useAssertCurrentUser();

  const [tasks] = useTasksQuery({
    where: {
      user_id: {
        _eq: user.id,
      },
      done_at: {
        _is_null: true,
      },
    },
  });

  return (
    <ToDoSection title={`Mentions of you (${tasks?.length || 0})`}>
      {tasks?.map(({ message, id }) => {
        const { topic } = message;
        return (
          <ToDoItem
            key={id}
            href={fillParamsInUrl(routes.spaceRoomTopic.path, {
              topicId: topic.id,
              roomId: topic.room.id,
              spaceId: topic.room.space.id,
            })}
          >
            <UIMessageText message={message} />
          </ToDoItem>
        );
      })}
    </ToDoSection>
  );
};

const UIMessageText = styled(MessageText)`
  ${theme.font.body14.build()}
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
