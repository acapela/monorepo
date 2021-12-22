import { formatRelative } from "date-fns";
import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { MessageText } from "~frontend/message/display/types/TextMessageContent";
import { PriorityIcon } from "~frontend/topics/priority";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { getLabelForPriority } from "~shared/priorities";
import { pluralize } from "~shared/text/pluralize";
import { IconCalendar, IconMessage } from "~ui/icons";
import { theme } from "~ui/theme";

import { highlighters } from "./highlighers";

export const RequestItem = observer(({ topic }: { topic: TopicEntity }) => {
  const highlighted = highlighters.reduce<null | { task: TaskEntity | null; icon: React.ReactNode }>(
    (acc, { icon, check }) => {
      if (acc) {
        return acc;
      }
      const taskOrStatus = check(topic);
      if (!taskOrStatus) {
        return null;
      }
      return { task: typeof taskOrStatus == "boolean" ? null : taskOrStatus, icon };
    },
    null
  );

  const nextTask = highlighted?.task ?? topic.openSelfAssignedTasks.last;
  const message = nextTask?.message ?? topic.lastSeenMessageByCurrentUserInfo?.message ?? topic.messages.last;

  const extraMembers = topic.members.filter((member) => !member.isCurrentUser && member.id !== topic.owner_id);
  const unreadMessagesCount = topic.unreadMessages.count;
  return (
    <Link href={`${topic.href}#${message?.id}`} passHref>
      <UIFeedItem>
        <UIImagery>
          <span style={{ width: 10 }}>{highlighted?.icon}</span>
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          <UserAvatar user={topic.owner!} size={36} />
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

const UIMessagePreview = styled.div<{ $maxLines: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${(props) => props.$maxLines};
  line-clamp: ${(props) => props.$maxLines};
  overflow: hidden;
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
  ${theme.spacing.close.asGap};
`;
