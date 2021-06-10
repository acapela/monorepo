import { useRouter } from "next/router";
import styled from "styled-components";
import { IconButton } from "~ui/buttons/IconButton";
import { SpaceBasicInfoFragment } from "~frontend/gql";
import { useAddSpaceMember, useEditSpaceMutation, useRemoveSpaceMember } from "~frontend/gql/spaces";
import { openUIPrompt } from "~frontend/utils/prompt";
import { IconEdit, IconMoreHoriz } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { hoverActionCss } from "~ui/transitions";
import { ItemTitle } from "~ui/typo";
import { MembersManager } from "../MembersManager";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { useSpaceUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { ElementNotificationBadge } from "~frontend/ui/ElementNotificationBadge";
import { formatNumberWithMaxCallback } from "~shared/numbers";
import { getSpaceColors } from "./spaceGradient";

interface Props {
  space: SpaceBasicInfoFragment;
}

export function SpaceCard({ space }: Props) {
  const spaceId = space.id;
  const router = useRouter();
  const unreadCount = useSpaceUnreadMessagesCount(space.id);

  const [addSpaceMember] = useAddSpaceMember();
  const [removeSpaceMember] = useRemoveSpaceMember();
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
    });

    if (!newSpaceName?.trim()) return;

    if (newSpaceName === space.name) return;

    await editSpace({ spaceId: space?.id, name: newSpaceName });
  }

  return (
    <>
      <UIHolder>
        {unreadCount > 0 && (
          <ElementNotificationBadge>{formatNumberWithMaxCallback(unreadCount, 99)}</ElementNotificationBadge>
        )}
        <UIBanner>
          <UIImage onClick={handleOpen} spaceId={space.id}></UIImage>
          <UIMenuIcon>
            <PopoverMenuTrigger
              options={[
                {
                  label: "Edit name",
                  onSelect: handleEditSpace,
                  icon: <IconEdit />,
                },
              ]}
            >
              <IconButton tooltip="Show options..." icon={<IconMoreHoriz />} />
            </PopoverMenuTrigger>
          </UIMenuIcon>
        </UIBanner>

        <UIInfo>
          <ItemTitle onClick={handleOpen}>{space.name}</ItemTitle>

          <UIMembers>
            <MembersManager
              users={space.members.map((m) => m.user)}
              onAddMemberRequest={handleJoin}
              onLeaveRequest={handleLeave}
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

  ${hoverActionCss}
`;

const UIBanner = styled.div`
  position: relative;
`;

const UIImage = styled.div<{ spaceId: string }>`
  padding-bottom: 58%;
  background-image: linear-gradient(to right bottom, ${(props) => getSpaceColors(props.spaceId).join(",")});
  border-radius: 16px;
  margin-bottom: 16px;
`;

const UIInfo = styled.div`
  text-align: center;
`;

const UIMenuIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #fff;
  cursor: pointer;

  ${IconButton} {
    color: #fff;
  }
`;

const UIMembers = styled.div``;
