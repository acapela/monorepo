import { useRouter } from "next/router";
import styled from "styled-components";
import { MoreHorizontal } from "~ui/icons";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SpaceBasicInfoFragment } from "~frontend/gql";
import { useAddSpaceMember, useEditSpaceMutation, useRemoveSpaceMember } from "~frontend/gql/spaces";
import { ItemTitle } from "~ui/typo";
import { MembersManager } from "../MembersManager";
import { PopoverMenu, Position } from "~ui/PopoverMenu";

interface Props {
  space: SpaceBasicInfoFragment;
}

export function SpaceCard({ space }: Props) {
  const spaceId = space.id;
  const user = useAssertCurrentUser();
  const router = useRouter();

  const [addSpaceMember] = useAddSpaceMember();
  const [removeSpaceMember] = useRemoveSpaceMember();
  const [editSpaceName] = useEditSpaceMutation();

  async function handleJoin(userId: string) {
    await addSpaceMember({ userId, spaceId });
  }

  async function handleLeave() {
    await removeSpaceMember({ userId: user.id, spaceId });
  }

  function handleOpen() {
    router.push(`space/${space.id}`);
  }

  async function handleEdit() {
    const name = window.prompt("Name of the space?");

    if (!name?.trim()) return;

    await editSpaceName({ name, spaceId });
  }

  return (
    <UIHolder>
      <UIBanner>
        <UIImage onClick={handleOpen}></UIImage>
        <UIMenuIcon>
          <PopoverMenu
            position={Position.LEFT_BOTTOM}
            offsetX={8}
            offsetY={8}
            options={[
              {
                label: "Edit name",
                onSelect: () => handleEdit(),
              },
            ]}
          >
            <MoreHorizontal />
          </PopoverMenu>
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
  );
}

const UIHolder = styled.div``;

const UIBanner = styled.div`
  position: relative;
`;

const UIImage = styled.div`
  padding-bottom: 58%;
  background-image: linear-gradient(to right bottom, rgb(150, 68, 113) 0%, rgb(244, 113, 117) 100%);
  border-radius: 1rem;
  margin-bottom: 1rem;
`;
const UIInfo = styled.div`
  text-align: center;
`;

const UIMenuIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  fill: white;

  z-index: 0;
  cursor: pointer;
`;

const UIMembers = styled.div``;
