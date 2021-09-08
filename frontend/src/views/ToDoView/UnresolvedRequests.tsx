import React, { Fragment } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { updateTask, useTasksQuery } from "~frontend/gql/tasks";
import { routes } from "~frontend/router";
import { fillParamsInUrl } from "~frontend/router/utils";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
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

    // TODO: Refactor this. This logic is used in 2 places. imho, this should be handled by a Hasura event handler
    function handleMarkAsRead() {
      const nowAsIsoString = new Date().toISOString();
      const done_at = task.type === "request-read" ? nowAsIsoString : null;
      updateTask({ taskId: task.id, input: { seen_at: nowAsIsoString, done_at } });
    }

    function handleMarkAsUnread() {
      const done_at = task.type === "request-read" ? null : undefined;
      updateTask({ taskId: task.id, input: { seen_at: null, done_at } });
    }

    if (task.seen_at) {
      options.push({
        label: "Mark as unread",
        onSelect: handleMarkAsUnread,
      });
    }

    if (!task.seen_at) {
      options.push({
        label: "Mark as read",
        onSelect: handleMarkAsRead,
      });
    }

    return options;
  }

  return (
    <ToDoSection title={`Requests (${tasks?.length || 0})`}>
      {tasks.length === 0 && (
        <EmptyStatePlaceholder icon={<IconCheck />} description="There are no pending tasks for you" />
      )}
      {tasks.map((task) => {
        const { message, id } = task;
        const { topic, user } = message;

        const tooltip =
          task.type === "request-response"
            ? `${user.name} has requested a response from you.`
            : `${user.name} wants to make sure you read this information.`;

        return (
          <Fragment key={id}>
            <ToDoItem
              href={fillParamsInUrl(routes.spaceRoomTopic.path, {
                topicId: topic.id,
                roomId: topic.room.id,
                spaceId: topic.room.space.id,
              })}
            >
              <UIInfo>
                <UITopArea data-tooltip={tooltip}>
                  <UITopicTitle>{topic.name}</UITopicTitle>
                </UITopArea>
                <UIMessageArea>
                  <UserAvatar user={user} size={"extra-small"} />
                  <UIMessageText message={message} />
                </UIMessageArea>
                <UIRightArea>
                  <PopoverMenuTrigger options={getMenuOptions(task)}>
                    <CircleOptionsButton />
                  </PopoverMenuTrigger>
                </UIRightArea>
              </UIInfo>
            </ToDoItem>
          </Fragment>
        );
      })}
    </ToDoSection>
  );
};

const UIInfo = styled.div<{}>`
  display: grid;
  grid-template-columns: 3fr 40px;
  grid-template-rows: 1fr 1fr;
  gap: 8px 0px;
  grid-template-areas:
    "TopArea RightMost"
    "MessageArea RightMost";
`;

const UITopArea = styled.div<{}>`
  grid-area: TopArea;
`;

const UITopicTitle = styled.div<{}>`
  ${theme.font.h6.build}
`;

const UIMessageArea = styled.div<{}>`
  grid-area: MessageArea;

  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 8px;
`;

const UIRightArea = styled.div<{}>`
  grid-area: RightMost;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIMessageText = styled(MessageText)`
  ${theme.font.body14.build()}
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;
