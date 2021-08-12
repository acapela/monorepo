import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import styled, { css } from "styled-components";

import { updateTopic } from "~frontend/gql/topics";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { getUserDisplayName } from "~frontend/utils/getUserDisplayName";
import { TopicDetailedInfoFragment, UserBasicInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { IconChevronDown } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const TopicOwner = ({ topic }: Props) => {
  const isTopicManager = useIsCurrentUserTopicManager(topic);

  const openerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpened, { unset: closeMenu, toggle: toggleMenu }] = useBoolean(false);

  const onOwnerSelect = (user: UserBasicInfoFragment) => {
    updateTopic({ topicId: topic.id, input: { owner_id: user.id } });
    closeMenu();
  };

  return (
    <>
      <UIHolder ref={openerRef} onClick={toggleMenu} isInteractive={isTopicManager}>
        <UserAvatar size="extra-small" user={topic.owner} disableNameTooltip />
        {topic.owner.name}
        {isTopicManager && <IconChevronDown />}
      </UIHolder>
      <AnimatePresence>
        {isMenuOpened && (
          <Popover anchorRef={openerRef} placement="bottom-start">
            <ItemsDropdown
              items={topic.room.members.map(({ user }) => user)}
              keyGetter={(user) => user.id}
              labelGetter={getUserDisplayName}
              onItemSelected={onOwnerSelect}
              onCloseRequest={closeMenu}
              selectedItems={[topic.owner]}
              iconGetter={(user) => <UserAvatar size="small" user={user} />}
            />
          </Popover>
        )}
      </AnimatePresence>
    </>
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
