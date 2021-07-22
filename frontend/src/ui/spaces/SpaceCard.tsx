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
import { IconEdit, IconSelection, IconTrash, IconUsers } from "~ui/icons";
import { hoverActionCss } from "~ui/transitions";
import { TextH3 } from "~ui/typo";
import { MembersManager } from "../MembersManager";
import { CornerOptionsMenu } from "../options/CornerOptionsMenu";
import { SpaceGradient } from "./spaceGradient";
import { routes } from "~frontend/../routes";
import { openUserPickerModal } from "../MembersManager/openUserPickerModal";
import { createResolvablePromise } from "~shared/promises";

interface Props {
  space: SpaceBasicInfoFragment;
  isClickable?: boolean;
}

export function SpaceCard({ space, isClickable = true }: Props) {
  const spaceId = space.id;
  const router = useRouter();
  const amIMember = isCurrentUserSpaceMember(space);

  const [addSpaceMember] = useAddSpaceMemberMutation();
  const [removeSpaceMember] = useRemoveSpaceMemberMutation();
  const [editSpace] = useEditSpaceMutation();

  async function handleJoin(userId: string) {
    await addSpaceMember({ userId, spaceId });
  }

  async function handleLeave(userId: string) {
    await removeSpaceMember({ userId, spaceId });
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

  async function handleMemberManagement() {
    const [closeModalPromise, closeModal] = createResolvablePromise<void>();

    function leaveAndCloseWhenNoMembers(userToRemove: string) {
      if (space.members.length === 1) {
        closeModal();
      }

      handleLeave(userToRemove);
    }

    await openUserPickerModal({
      id: space.id,
      placeOfMembership: "space",
      onAddUser: handleJoin,
      onRemoveUser: leaveAndCloseWhenNoMembers,
      asyncResolveRequest: closeModalPromise,
    });
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
                  label: "Edit name...",
                  onSelect: handleEditSpace,
                  icon: <IconEdit />,
                },
                {
                  label: "Manage members...",
                  onSelect: handleMemberManagement,
                  icon: <IconUsers />,
                },
                {
                  label: "Delete...",
                  onSelect: handleDeleteSpace,
                  icon: <IconTrash />,
                  isDestructive: true,
                },
              ]}
              tooltip="Show options..."
            />
          )}
          <UIImage onClick={handleOpen} spaceId={space.id}></UIImage>
        </UIBanner>

        <UIInfo>
          <TextH3 onClick={handleOpen} speziaExtended>
            {space.name}
          </TextH3>

          <UIMembers>
            <MembersManager
              users={space.members.map((m) => m.user)}
              onAddMemberRequest={handleJoin}
              onRemoveMemberRequest={handleLeave}
              isReadonly={!amIMember}
            />
          </UIMembers>
        </UIInfo>
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div<{ isClickable?: boolean }>`
  padding: 1rem;
  margin: -1rem;
  cursor: ${(props) => (props.isClickable ? "pointer" : "default")};
  position: relative;
  /* Don't over-stretch inside grid/flex if has wide content */
  min-width: 0;

  ${(props) => (props.isClickable ? hoverActionCss : null)}
`;

const UIBanner = styled.div`
  position: relative;
`;

const UIImage = styled(SpaceGradient)`
  padding-bottom: 58%;
  ${borderRadius.card};
  margin-bottom: 16px;
`;

const UIInfo = styled.div`
  text-align: center;
`;

const UIMembers = styled.div``;
