import styled, { css } from "styled-components";
import { IconChevronDown } from "~ui/icons";
import { theme } from "~ui/theme";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { TopicDetailedInfoFragment } from "~gql";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const TopicOwner = ({ topic }: Props) => {
  const isTopicManager = useIsCurrentUserTopicManager(topic);

  if (!topic.owner) return null;

  return (
    <UIHolder isInteractive={isTopicManager}>
      <UserAvatar size="extra-small" user={topic.owner} disableNameTooltip />
      {topic.owner.name}
      {isTopicManager && <IconChevronDown />}
    </UIHolder>
  );
};

const UIHolder = styled.div<{ isInteractive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  ${theme.font.body12.build()};
  color: ${theme.colors.layout.supportingText()};

  ${theme.transitions.hover()}

  ${({ isInteractive }) =>
    isInteractive
      ? css`
          &:hover {
            color: ${theme.colors.layout.link()};
          }
        `
      : css`
          pointer-events: none;
        `}
`;
