import { gql } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import styled, { css } from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { getUserDisplayName } from "~frontend/utils/getUserDisplayName";
import { useUpdateTopic } from "~frontend/views/RoomView/shared";
import { TopicOwner_RoomFragment, TopicOwner_TopicFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { IconChevronDown } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

const fragments = {
  room: gql`
    ${useIsCurrentUserTopicManager.fragments.room}

    fragment TopicOwner_room on room {
      ...IsCurrentUserTopicManager_room
      members {
        user {
          id
          name
          email
        }
      }
    }
  `,
  topic: gql`
    ${useIsCurrentUserTopicManager.fragments.topic}
    ${UserAvatar.fragments.user}

    fragment TopicOwner_topic on topic {
      id
      ...IsCurrentUserTopicManager_topic
      owner {
        id
        name
        ...UserAvatar_user
      }
    }
  `,
};

type Props = { room: TopicOwner_RoomFragment; topic: TopicOwner_TopicFragment };

export const TopicOwner = withFragments(fragments, ({ room, topic }: Props) => {
  const isTopicManager = useIsCurrentUserTopicManager(room, topic);
  const [updateTopic] = useUpdateTopic();

  const openerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, { unset: closeMenu, toggle: toggleMenu }] = useBoolean(false);

  const onOwnerSelect = (user: { id: string }) => {
    updateTopic({ variables: { id: topic.id, input: { owner_id: user.id } } });
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
        {isMenuOpen && (
          <Popover anchorRef={openerRef} placement="bottom-start" enableScreenCover>
            <ItemsDropdown
              items={room.members.map(({ user }) => user)}
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
});

const UIHolder = styled.div<{ isInteractive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
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
