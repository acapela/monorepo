import gql from "graphql-tag";
import React from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { NotificationCount } from "~frontend/ui/NotificationCount";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { DashboardNavigationCard } from "~frontend/views/DashboardView/Navigation/DashboardNavigationCard";
import { DashboardTopicCard_TopicFragment } from "~gql";
import { theme } from "~ui/theme";

const fragments = {
  topic: gql`
    ${UserAvatar.fragments.user}

    fragment DashboardTopicCard_topic on topic {
      id
      closed_at
      name
      owner {
        name
        ...UserAvatar_user
      }
    }
  `,
};

interface Props {
  topic: DashboardTopicCard_TopicFragment;
}

export const DashboardTopicCard = withFragments(fragments, ({ topic }: Props) => {
  const unreadMessagesCount = useTopicUnreadMessagesCount(topic.id);
  const hasUnreadMessages = unreadMessagesCount > 0;

  return (
    <DashboardNavigationCard>
      <UITopicNameHolder>
        {hasUnreadMessages && <NotificationCount value={unreadMessagesCount} />}
        <UITopicName>{topic.name}</UITopicName>
      </UITopicNameHolder>
      <UITopicOwnerHolder>
        <UserAvatar size="extra-small" user={topic.owner} disableNameTooltip />
        {topic.owner.name}
      </UITopicOwnerHolder>
    </DashboardNavigationCard>
  );
});

const UITopicNameHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const UITopicName = styled.h4`
  ${theme.font.semibold.build()};
`;

const UITopicOwnerHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  ${theme.font.body12.build()};
  color: ${theme.colors.layout.supportingText()};
`;
