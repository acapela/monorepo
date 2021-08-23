import React, { Fragment } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { updateTask, useTasksQuery } from "~frontend/gql/tasks";
import { routes } from "~frontend/router";
import { fillParamsInUrl } from "~frontend/router/utils";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { TaskBasicInfoFragment } from "~gql";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconCheck } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

import { ToDoItem } from "./ToDoItem";
import { ToDoSection } from "./ToDoSection";

export const UnresolvedRequests = () => {
  const user = useAssertCurrentUser();

  const [tasks = []] = useTasksQuery({
    where: {
      user_id: {
        _eq: user.id,
      },
      done_at: {
        _is_null: true,
      },
    },
  });

  function getMenuOptions(task: TaskBasicInfoFragment): PopoverMenuOption[] {
    const options: PopoverMenuOption[] = [];

    if (task.seen_at) {
      options.push({
        label: "Mark as unread",
        onSelect: () => updateTask({ taskId: task.id, input: { seen_at: null } }),
      });
    }

    if (!task.seen_at) {
      options.push({
        label: "Mark as read",
        onSelect: () => updateTask({ taskId: task.id, input: { seen_at: new Date().toISOString() } }),
      });
    }

    return options;
  }

  return (
    <ToDoSection title={`Requests of your input (${tasks?.length || 0})`}>
      {tasks.length === 0 && (
        <EmptyStatePlaceholder icon={<IconCheck />} description="There are no pending tasks for you" />
      )}
      {tasks.map((task) => {
        const { message, id } = task;
        const { topic } = message;

        return (
          <Fragment key={id}>
            <ToDoItem
              href={fillParamsInUrl(routes.spaceRoomTopic.path, {
                topicId: topic.id,
                roomId: topic.room.id,
                spaceId: topic.room.space.id,
              })}
            >
              <UIMessageText message={message} />
              <PopoverMenuTrigger options={getMenuOptions(task)}>
                <CircleOptionsButton />
              </PopoverMenuTrigger>
            </ToDoItem>
          </Fragment>
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
  flex-grow: 1;
`;
