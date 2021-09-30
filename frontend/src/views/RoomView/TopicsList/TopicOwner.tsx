import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import { useRef } from "react";
import styled, { css } from "styled-components";

import { RoomEntity } from "~frontend/clientdb/room";
import { TopicEntity } from "~frontend/clientdb/topic";
import { UserEntity } from "~frontend/clientdb/user";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { getUserDisplayName } from "~frontend/utils/getUserDisplayName";
import { useBoolean } from "~shared/hooks/useBoolean";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { IconChevronDown } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

const fragments = {
  room: gql`
    fragment TopicOwner_room on room {
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

type Owner = TopicOwner_TopicFragment["owner"];

const useUpdateTopicOwner = () =>
  useMutation<UpdateTopicOwnerMutation, UpdateTopicOwnerMutationVariables & { owner: Owner }>(
    gql`
      ${fragments.topic}

      mutation UpdateTopicOwner($id: uuid!, $ownerId: uuid!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: { owner_id: $ownerId }) {
          id
          ...TopicOwner_topic
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", id: vars.id, owner_id: vars.ownerId, owner: vars.owner },
      }),
    }
  );

export const TopicOwner = withFragments(fragments, ({ room, topic }: Props) => {
  const isTopicManager = useIsCurrentUserTopicManager(topic);
  const [updateTopicOwner] = useUpdateTopicOwner();

  const openerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, { unset: closeMenu, toggle: toggleMenu }] = useBoolean(false);

  const onOwnerSelect = (user: UserEntity) => {
    topic.update({ owner_id: user.id });
    closeMenu();
  };

  return (
    <>
      <UIHolder ref={openerRef} onClick={toggleMenu} isInteractive={isTopicManager}>
        {topic.owner && <UserAvatar size="extra-small" user={topic.owner} disableNameTooltip />}
        {topic.owner?.name}
        {isTopicManager && <IconChevronDown />}
      </UIHolder>
      <AnimatePresence>
        {isMenuOpen && (
          <Popover anchorRef={openerRef} placement="bottom-start" enableScreenCover>
            <ItemsDropdown<UserEntity>
              items={room.members.all}
              keyGetter={(user) => user.id}
              labelGetter={getUserDisplayName}
              onItemSelected={onOwnerSelect}
              onCloseRequest={closeMenu}
              selectedItems={[topic.owner!]}
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
