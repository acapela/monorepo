import gql from "graphql-tag";
import React from "react";
import styled, { css } from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { NotificationCount } from "~frontend/ui/NotificationCount";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { DashboardTopicCard_TopicFragment } from "~gql";
import { theme } from "~ui/theme";
import { hoverActionCss } from "~ui/transitions";

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
    <UIHolder isClosed={!!topic.closed_at}>
      <UITopicNameHolder>
        {hasUnreadMessages && <NotificationCount value={unreadMessagesCount} />}
        <UITopicName>{topic.name}</UITopicName>
      </UITopicNameHolder>
      <UITopicOwnerHolder>
        <UserAvatar size="extra-small" user={topic.owner} disableNameTooltip />
        {topic.owner.name}
      </UITopicOwnerHolder>
    </UIHolder>
  );
});

const PADDING = "12px";

const UIHolder = styled.div<{ isClosed: boolean }>`
  background-color: ${theme.colors.layout.foreground()};
  position: relative;
  padding: ${PADDING} 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  touch-action: none;

  ${theme.borderRadius.button}

  ${hoverActionCss}

  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        opacity: 0.5;
      `;
    }
  }}
`;

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
