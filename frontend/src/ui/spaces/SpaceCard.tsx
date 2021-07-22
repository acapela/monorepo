import { useRouter } from "next/router";
import styled from "styled-components";
import { handleWithStopPropagation } from "~shared/events";
import { ToggleButton } from "~ui/buttons/ToggleButton";
import { CardBase } from "~ui/card/Base";
import { EntityKindLabel, PrimaryItemTitle } from "~ui/theme/functional";
import { routes } from "~frontend/../routes";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import {
  deleteSpace,
  isCurrentUserSpaceMember,
  useAddSpaceMemberMutation,
  useEditSpaceMutation,
  useRemoveSpaceMemberMutation,
} from "~frontend/gql/spaces";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { SpaceBasicInfoFragment } from "~gql";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconCheck, IconEdit, IconLogIn, IconSelection, IconTrash } from "~ui/icons";
import { CornerOptionsMenu } from "../options/CornerOptionsMenu";
import { AvatarList } from "../users/AvatarList";
import { JoinToggleButton } from "../buttons/JoinToggleButton";
import { useSpaceManager } from "~frontend/../pages/space/useSpaceManager";

interface Props {
  space: SpaceBasicInfoFragment;
}

export function SpaceCard({ space }: Props) {
  const { editNameWithModal, isCurrentUserMember, join, leave, remove } = useSpaceManager(space);

  const router = useRouter();
  const user = useAssertCurrentUser();

  function handleOpen() {
    router.push(`space/${space.id}`);
  }

  return (
    <>
      <UIHolder isClickable onClick={handleOpen}>
        <UIBanner>
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
        </UIBanner>

        <UIInfo>
          <AvatarList size="medium" users={space.members.map((m) => m.user)} />
          <EntityKindLabel>SPACE</EntityKindLabel>
          <PrimaryItemTitle>{space.name}</PrimaryItemTitle>

          <UIMembers>
            {user && <JoinToggleButton isMember={isCurrentUserMember} onJoin={join} onLeave={leave} />}
          </UIMembers>
        </UIInfo>
      </UIHolder>
    </>
  );
}

const UIHolder = styled(CardBase)`
  cursor: pointer;
  position: relative;
  /* Don't over-stretch inside grid/flex if has wide content */
  min-width: 0;
`;

const UIBanner = styled.div`
  position: relative;
`;

const UIInfo = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${AvatarList} {
    margin-bottom: 24px;
  }
`;

const UIMembers = styled.div``;
