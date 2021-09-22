import gql from "graphql-tag";
import styled from "styled-components";

import { DashboardTaskCard_TaskFragment } from "~frontend/../../gql";
import { theme } from "~frontend/../../ui/theme";
import { withFragments } from "~frontend/gql/utils";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";

import { getMessageMentionSnippet } from "./messageContentSnippet";

const fragments = {
  task: gql`
    ${UserAvatar.fragments.user}

    fragment DashboardTaskCard_task on task {
      id
      user {
        id
        ...UserAvatar_user
      }
      message {
        id
        content

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
  hideUserInfo?: boolean;
}

export const DashboardTaskCard = withFragments(fragments, function DashboardTaskCard({ task, hideUserInfo }: Props) {
  const topicTitle = task.message.topic.name;

  const assignedUserId = task.user.id;

  const messageMentionSnippet = getMessageMentionSnippet(task.message.content, assignedUserId);

  return (
    <UIHolder>
      <UITitle>{topicTitle}</UITitle>
      {messageMentionSnippet && (
        <UISnippet>
          <MessageText content={messageMentionSnippet} />
        </UISnippet>
      )}
      {!hideUserInfo && (
        <UIUserInfo>
          <UserAvatar user={task.user} size="extra-small" />
          <span>{task.user.name}</span>
        </UIUserInfo>
      )}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  background-color: ${theme.colors.layout.foreground()};
  ${theme.borderRadius.item};
  padding: 12px 16px;
  gap: 8px;
  display: flex;
  flex-direction: column;
`;

const UITitle = styled.h4`
  ${theme.font.semibold.build()};
`;

const UISnippet = styled.div`
  max-width: 100%;
  ${MessageText} {
    > div {
      display: flex;
      max-width: 100%;
    }
  }
  > div {
    display: flex;
  }
  .ProseMirror {
    overflow: hidden;
    text-overflow: ellipsis;
    &,
    * {
      white-space: nowrap !important;
      display: inline;
    }
  }
`;

const UIUserInfo = styled.div`
  display: flex;

  ${theme.font.body12.build()};

  span {
    margin-left: 1ch;
  }
`;
