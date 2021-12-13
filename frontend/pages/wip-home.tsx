import { differenceInHours, formatRelative } from "date-fns";
import { orderBy } from "lodash";
import { observer } from "mobx-react";
import Link from "next/link";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { MessageText } from "~frontend/message/display/types/TextMessageContent";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { pluralize } from "~shared/text/pluralize";
import { theme } from "~ui/theme";

const getOpenSelfAssignedTasks = (topic: TopicEntity) =>
  topic.tasks.query((task) => task.isAssignedToSelf && !task.isDone);

const checkDueWithinNextDay = (task: TaskEntity) =>
  task.dueDate ? differenceInHours(task.dueDate, new Date()) <= 24 : false;

const highlighters: {
  icon: string;
  check: (topic: TopicEntity) => boolean | TaskEntity;
}[] = [
  {
    icon: "🔵",
    check: (topic) => getOpenSelfAssignedTasks(topic).query((task) => !task.seen_at).first ?? false,
  },
  {
    icon: "🔔",
    check: (topic) => getOpenSelfAssignedTasks(topic).query(checkDueWithinNextDay).first ?? false,
  },
  {
    icon: "✉️",
    check: (topic) => topic.unreadMessages.count > 0,
  },
];

const FeedItem = observer(({ topic }: { topic: TopicEntity }) => {
  const highlighted = highlighters.reduce<TaskEntity | boolean | null>((acc, { check }) => acc ?? check(topic), null);

  let nextTask = highlighted && typeof highlighted != "boolean" ? highlighted : null;
  nextTask ??= getOpenSelfAssignedTasks(topic).last;
  const message = nextTask?.message ?? topic.lastSeenMessageByCurrentUserInfo?.message ?? topic.messages.last;

  const extraMembers = topic.members.filter((member) => !member.isCurrentUser && member.id !== topic.owner_id);
  const unreadMessagesCount = topic.unreadMessages.count;
  return (
    <Link href={`${topic.href}#${message?.id}`} passHref>
      <UIFeedItem>
        <UIImagery>
          <span style={{ width: 10 }}>
            {highlighters.reduce((label, { check, icon }) => label || (check(topic) ? icon : ""), "")}
          </span>
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
              <div>
                ✉️ {unreadMessagesCount} new {pluralize(unreadMessagesCount, "reply", "replies")}
              </div>
            )}
            {nextTask?.dueDate && <div>🗓 {formatRelative(nextTask?.dueDate, new Date())}</div>}
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

export default observer(() => {
  const db = useDb();
  const openTopics = db.topic.query((topic) => !topic.isArchived && !topic.isClosed);
  const unreadTasksCount = openTopics.query(
    (topic) => getOpenSelfAssignedTasks(topic).query({ seen_at: null }).hasItems
  ).count;
  return (
    <SidebarLayout>
      <UILayout>
        <UITitle>Home</UITitle>
        <UIWelcome>
          Hi there 👋{" "}
          {unreadTasksCount > 0 && (
            <>
              You have <UIUnreadIndicator>{unreadTasksCount} new unread</UIUnreadIndicator>{" "}
              {pluralize(unreadTasksCount, "request", "requests")}.
            </>
          )}
        </UIWelcome>
        {orderBy(openTopics.all, (topic) => highlighters.map(({ check }) => !check(topic))).map((topic) => (
          <FeedItem key={topic.id} topic={topic} />
        ))}
      </UILayout>
    </SidebarLayout>
  );
});

const UILayout = styled.div`
  padding: 50px;
  max-width: 900px;
`;

const UITitle = styled.h1`
  ${theme.typo.pageTitle};
  margin-bottom: 10px;
`;

const UIWelcome = styled.div`
  ${theme.typo.content};
`;

const UIUnreadIndicator = styled.span`
  ${theme.typo.content.semibold};
`;

const UIFeedItem = styled.a`
  margin-left: -30px;
  padding: 15px 5px;
  display: flex;
  flex-direction: row;
  gap: 10px;

  &:hover {
    ${theme.colors.layout.background.hover.opacity(0.5).asBg};
  }
`;

const UIFeedItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UIFeedItemTitle = styled.h3`
  ${theme.typo.content.semibold.resetLineHeight};
`;

const UIImagery = styled.div`
  height: max-content;
  display: flex;
  align-items: center;
  gap: 15px;
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
  align-items: center;
  gap: 10px;
  ${theme.typo.content.secondary}
`;

const UIMemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
