import { useRouter } from "next/router";
import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
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
import { hoverActionCss } from "~ui/transitions";
import { TextH3 } from "~ui/typo";
import { MembersManager } from "../MembersManager";
import { CornerOptionsMenu } from "../options/CornerOptionsMenu";
import { SpaceGradient } from "./spaceGradient";
import { routes } from "~frontend/../routes";
import { CardBase } from "~frontend/../../ui/card/Base";
import { EntityKindLabel } from "~frontend/../../ui/theme/functional";
import { AvatarList } from "../users/AvatarList";
import { ToggleButton } from "~frontend/../../ui/buttons/ToggleButton";
import { handleWithStopPropagation } from "~frontend/../../shared/events";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";

interface Props {
  space: SpaceBasicInfoFragment;
  isClickable?: boolean;
}

export function SpaceCard({ space, isClickable = true }: Props) {
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
    if (isClickable) {
      router.push(`space/${space.id}`);
    }
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
      <UIHolder isClickable={isClickable}>
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
          <AvatarList size={32} users={space.members.map((m) => m.user)} />
          <EntityKindLabel>SPACE</EntityKindLabel>
          <TextH3 onClick={handleOpen} speziaExtended>
            {space.name}
          </TextH3>

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
