import { formatRelative } from "date-fns";
import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { TopicEntity } from "@aca/frontend/clientdb/topic";
import { MessageText } from "@aca/frontend/message/display/types/TextMessageContent";
import { UIMessagePreview } from "@aca/frontend/message/UIMessagePreview";
import { PriorityIcon } from "@aca/frontend/topics/priority";
import { AvatarList } from "@aca/frontend/ui/users/AvatarList";
import { UserAvatar } from "@aca/frontend/ui/users/UserAvatar";
import { findAndMap } from "@aca/shared/array";
import { None } from "@aca/shared/none";
import { getLabelForPriority } from "@aca/shared/priorities";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconCalendar, IconMessage } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { highlighters } from "./highlighers";

export const RequestItem = observer(({ topic }: { topic: TopicEntity }) => {
  const highlighted = findAndMap(highlighters, ({ check, icon }) => {
    const taskOrStatus = check(topic);
    if (!taskOrStatus) {
      return None;
    }
    return {
      task: typeof taskOrStatus == "object" && taskOrStatus.__typename == "task" ? taskOrStatus : null,
      icon,
    };
  });

  const nextTask = highlighted?.task ?? topic.selfAssignedOpenTasks.last;
  const message = nextTask?.message ?? topic.lastSeenMessageByCurrentUserInfo?.message ?? topic.messages.last;

  // User used for the avatar, and thus not needing to be shown in the extra members list
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mainUser = message?.user ?? topic.owner!;
  const extraMembers = topic.members.filter((member) => !member.isCurrentUser && member.id !== mainUser.id);
  const unreadMessagesCount = topic.unreadMessages.count;
  return (
    <Link href={`${topic.href}#${message?.id}`} passHref>
      <UIFeedItem>
        <UIImagery>
          {/*This needs to have a fixed width, to hold the space even if there is no icon*/}
          <span style={{ width: 10 }}>{highlighted?.icon}</span>
          <UserAvatar user={mainUser} size={36} />
        </UIImagery>
        <UIFeedItemContent>
          <UIFeedItemTitle>{topic.name}</UIFeedItemTitle>
          {message && (
            <UIMessagePreview $maxLines={1}>
              <MessageText content={message.content} />
            </UIMessagePreview>
          )}

          <UIExtraInfo>
            {unreadMessagesCount > 0 && (
              <UICenteredExtras>
                <IconMessage style={{ position: "relative", top: 1 }} />
                <span>
                  {unreadMessagesCount} new {pluralize(unreadMessagesCount, "reply", "replies")}
                </span>
              </UICenteredExtras>
            )}
            {nextTask?.dueDate && (
              <UICenteredExtras>
                <IconCalendar /> {formatRelative(nextTask?.dueDate, new Date())}
              </UICenteredExtras>
            )}
            {topic.priority && (
              <UICenteredExtras>
                <PriorityIcon priority={topic.priority} /> {getLabelForPriority(topic.priority)}
              </UICenteredExtras>
            )}
            {extraMembers.length > 0 && (
              <UIMemberInfo>
                <AvatarList users={extraMembers} maxVisibleCount={6} size={20} />
                <div>
                  {extraMembers.length} other {pluralize(extraMembers.length, "participant", "participants")}
                </div>
              </UIMemberInfo>
            )}
          </UIExtraInfo>
        </UIFeedItemContent>
      </UIFeedItem>
    </Link>
  );
});

const UIFeedItem = styled.a`
  margin-left: -30px;
  padding: 15px 5px;
  display: flex;
  flex-direction: row;
  ${theme.spacing.actions.asGap};

  &:hover {
    ${theme.colors.layout.background.hover.opacity(0.5).asBg};
  }
`;

const UIFeedItemContent = styled.div`
  display: flex;
  flex-direction: column;
  ${theme.spacing.close.asGap};
`;

const UIFeedItemTitle = styled.h3`
  ${theme.typo.content.semibold.resetLineHeight};
`;

const UIImagery = styled.div`
  height: max-content;
  display: flex;
  align-items: center;
  ${theme.spacing.actionsSection.asGap};
`;

const UIExtraInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${theme.spacing.actionsSection.asGap};
  ${theme.typo.content.secondary}
`;

const UIMemberInfo = styled.div`
  display: flex;
  align-items: center;
  ${theme.spacing.close.asGap};
`;

const UICenteredExtras = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap};
`;
