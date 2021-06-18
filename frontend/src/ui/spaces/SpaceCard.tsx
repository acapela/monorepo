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
import { ElementNotificationBadge } from "~frontend/ui/ElementNotificationBadge";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { useSpaceUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { SpaceBasicInfoFragment } from "~gql";
import { formatNumberWithMaxCallback } from "~shared/numbers";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconEdit, IconTrash } from "~ui/icons";
import { hoverActionCss } from "~ui/transitions";
import { ItemTitle } from "~ui/typo";
import { MembersManager } from "../MembersManager";
import { CornerOptionsMenu } from "../options/CornerOptionsMenu";
import { SpaceGradient } from "./spaceGradient";

interface Props {
  space: SpaceBasicInfoFragment;
}

export function SpaceCard({ space }: Props) {
  const spaceId = space.id;
  const router = useRouter();
  const amIMember = isCurrentUserSpaceMember(space);
  const unreadCount = useSpaceUnreadMessagesCount(space.id);

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
    router.push(`space/${space.id}`);
  }

  async function handleEditSpace() {
    const newSpaceName = await openUIPrompt({
      title: "Change space name",
      placeholder: "e.g. Design team, Marketing department, iOS developers...",
      submitLabel: "Change name",
      validateInput: createLengthValidator("Space name", 3),
      initialValue: space.name,
    });

    if (!newSpaceName?.trim()) return;

    if (newSpaceName === space.name) return;

    await editSpace({ spaceId: space?.id, name: newSpaceName });
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

    await deleteSpace({ spaceId: space.id });
  }

  return (
    <>
      <UIHolder>
        {unreadCount > 0 && (
          <ElementNotificationBadge>{formatNumberWithMaxCallback(unreadCount, 99)}</ElementNotificationBadge>
        )}
        <UIBanner>
          {amIMember && (
            <CornerOptionsMenu
              options={[
                {
                  label: "Edit space name",
                  onSelect: handleEditSpace,
                  icon: <IconEdit />,
                },
                {
                  label: "Delete space",
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
          <ItemTitle onClick={handleOpen}>{space.name}</ItemTitle>

          <UIMembers>
            <MembersManager
              users={space.members.map((m) => m.user)}
              onAddMemberRequest={handleJoin}
              onLeaveRequest={handleLeave}
              isReadonly={!amIMember}
            />
          </UIMembers>
        </UIInfo>
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div`
  padding: 1rem;
  margin: -1rem;
  cursor: pointer;
  position: relative;
  /* Don't over-stretch inside grid/flex if has wide content */
  min-width: 0;

  ${hoverActionCss}
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
