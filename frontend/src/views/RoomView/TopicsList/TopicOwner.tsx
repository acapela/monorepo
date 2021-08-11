import styled, { css } from "styled-components";
import { IconChevronDown } from "~ui/icons";
import { theme } from "~ui/theme";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { TopicDetailedInfoFragment } from "~gql";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const TopicOwner = ({ topic }: Props) => {
  const user = useAssertCurrentUser();

  if (!topic.owner) return null;

  const isInteractive = [topic.owner.id, topic.room?.owner?.id].includes(user.id);

  return (
    <UIHolder isInteractive={isInteractive}>
      <UserAvatar size="extra-small" user={topic.owner} disableNameTooltip />
      {topic.owner.name}
      {isInteractive && <IconChevronDown />}
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
      : css``}
`;
