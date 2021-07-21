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

interface Props {
  space: SpaceBasicInfoFragment;
}

export function SpaceCard({ space }: Props) {
  const spaceId = space.id;
  const router = useRouter();
  const amIMember = isCurrentUserSpaceMember(space);
  const user = useAssertCurrentUser();

  const [addSpaceMember] = useAddSpaceMemberMutation();
  const [removeSpaceMember] = useRemoveSpaceMemberMutation();
  const [editSpace] = useEditSpaceMutation();

  async function handleJoin() {
    await addSpaceMember({ userId: user.id, spaceId });
  }

  async function handleLeave() {
    await removeSpaceMember({ userId: user.id, spaceId });
  }

  function handleOpen() {
    router.push(`space/${space.id}`);
  }

  async function handleEditSpace() {
    const newSpaceName = await openUIPrompt({
      title: "Change space name",
      placeholder: "e.g. Design team, Marketing department, iOS developers...",
      inputIcon: <IconSelection />,
      submitLabel: "Change name",
      validateInput: createLengthValidator("Space name", 3),
      initialValue: space.name,
    });

    if (!newSpaceName?.trim()) return;

    if (newSpaceName === space.name) return;

    await editSpace({ spaceId: space?.id, input: { name: newSpaceName } });
  }

  async function handleDeleteSpace() {
    const didConfirm = await openConfirmPrompt({
      title: `Remove space`,
      description: (
        <>
          Are you sure you want to remove space <strong>{space.name}</strong>
        </>
      ),
      confirmLabel: `Remove`,
    });

    if (!didConfirm) return;

    routes.spaces.push({});

    await deleteSpace({ spaceId: space.id });
  }

  return (
    <>
      <UIHolder isClickable onClick={handleOpen}>
        <UIBanner>
          {amIMember && (
            <CornerOptionsMenu
              options={[
                {
                  label: "Edit space name...",
                  onSelect: handleEditSpace,
                  icon: <IconEdit />,
                },
                {
                  label: "Delete space...",
                  onSelect: handleDeleteSpace,
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
            <ToggleButton
              onClick={handleWithStopPropagation(() => (amIMember ? handleLeave() : handleJoin()))}
              isActive={amIMember}
              icon={amIMember ? <IconCheck /> : <IconLogIn />}
            >
              {amIMember ? "Joined" : "Join"}
            </ToggleButton>
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
