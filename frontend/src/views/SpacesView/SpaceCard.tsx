import { gql } from "@apollo/client";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useIsCurrentUserSpaceMember } from "~frontend/gql/spaces";
import { withFragments } from "~frontend/gql/utils";
import { RouteLink, routes } from "~frontend/router";
import { useSpaceManager } from "~frontend/spaces/useSpaceManager";
import { JoinToggleButton } from "~frontend/ui/buttons/JoinToggleButton";
import { CornerOptionsMenu } from "~frontend/ui/options/CornerOptionsMenu";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { SpaceCard_SpaceFragment } from "~gql";
import { CardBase } from "~ui/card/Base";
import { IconEdit, IconTrash } from "~ui/icons";
import { EntityKindLabel, PrimaryItemTitle } from "~ui/theme/functional";

const fragments = {
  space: gql`
    ${useIsCurrentUserSpaceMember.fragments.space}
    ${AvatarList.fragments.user}

    fragment SpaceCard_space on space {
      id
      name

      ...SpaceWithMembers

      members {
        space_id
        user_id
        user {
          ...AvatarList_user
        }
      }
    }
  `,
};

interface Props {
  space: SpaceCard_SpaceFragment;
}

export const SpaceCard = withFragments(fragments, function SpaceCard({ space }: Props) {
  const { editNameWithModal, isCurrentUserMember, join, leave, remove } = useSpaceManager(space);

  const user = useAssertCurrentUser();

  return (
    <RouteLink route={routes.space} params={{ spaceId: space.id }}>
      <UIHolder>
        {isCurrentUserMember && (
          <CornerOptionsMenu
            options={[
              {
                label: "Edit space name...",
                onSelect: editNameWithModal,
                icon: <IconEdit />,
              },
              {
                label: "Delete space...",
                onSelect: remove,
                icon: <IconTrash />,
                isDestructive: true,
              },
            ]}
            tooltip="Show options..."
          />
        )}

        <UIInfo>
          <AvatarList size="medium" users={space.members.map((m) => m.user)} />
          <EntityKindLabel>SPACE</EntityKindLabel>
          <UIPrimaryItemTitle>{space.name}</UIPrimaryItemTitle>

          <UIMembers>
            {user && <JoinToggleButton isMember={isCurrentUserMember} onJoin={join} onLeave={leave} />}
          </UIMembers>
        </UIInfo>
      </UIHolder>
    </RouteLink>
  );
});

const UIHolder = styled(CardBase)<{}>`
  cursor: pointer;
  position: relative;
  /* Don't over-stretch inside grid/flex if has wide content */
  min-width: 0;
`;

const UIInfo = styled.div<{}>`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${AvatarList} {
    margin-bottom: 24px;
  }
`;

const UIPrimaryItemTitle = styled<{}>(PrimaryItemTitle)`
  margin-top: 8px;
  margin-bottom: 16px;
`;

const UIMembers = styled.div<{}>``;
