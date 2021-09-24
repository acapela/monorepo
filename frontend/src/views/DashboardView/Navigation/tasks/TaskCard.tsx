import gql from "graphql-tag";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { getTeamInvitationDisplayName } from "~frontend/utils/getTeamInvitationDisplayName";
import { DashboardNavigationCard } from "~frontend/views/DashboardView/Navigation/DashboardNavigationCard";
import { DashboardTaskCard_TaskFragment } from "~gql";
import { theme } from "~ui/theme";

import { getMessageMentionSnippet } from "./messageContentSnippet";

const fragments = {
  task: gql`
    ${UserAvatar.fragments.user}

    fragment DashboardTaskCard_task on task {
      id
      user {
        id
        name
        ...UserAvatar_user
      }
      team_invitation {
        slack_user_id
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

  const messageMentionSnippet = task.user
    ? getMessageMentionSnippet(task.message.content, task.user.id)
    : task.message.content;

  return (
    <DashboardNavigationCard>
      <UITitle>{topicTitle}</UITitle>
      {messageMentionSnippet && (
        <UISnippet>
          <MessageText content={messageMentionSnippet} />
        </UISnippet>
      )}
      {!hideUserInfo &&
        (task.user ? (
          <UIUserInfo>
            <UserAvatar user={task.user} size="extra-small" />
            <span>{task.user.name}</span>
          </UIUserInfo>
        ) : (
          task.team_invitation && <UIUserInfo>{getTeamInvitationDisplayName(task.team_invitation)}</UIUserInfo>
        ))}
    </DashboardNavigationCard>
  );
});

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
