import { useRouter } from "next/router";
import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SpaceBasicInfoFragment } from "~frontend/gql";
import { useAddSpaceMember, useRemoveSpaceMember } from "~frontend/gql/spaces";
import { ItemTitle } from "~ui/typo";
import { MembersManager } from "../MembersManager";

interface Props {
  space: SpaceBasicInfoFragment;
}

export function SpaceCard({ space }: Props) {
  const spaceId = space.id;
  const user = useAssertCurrentUser();
  const router = useRouter();

  const [addSpaceMember] = useAddSpaceMember();
  const [removeSpaceMember] = useRemoveSpaceMember();

  async function handleJoin(userId: string) {
    await addSpaceMember({ userId, spaceId });
  }

  async function handleLeave() {
    await removeSpaceMember({ userId: user.id, spaceId });
  }

  function handleOpen() {
    router.push(`space/${space.id}`);
  }

  return (
    <UIHolder>
      <UIImage onClick={handleOpen}></UIImage>
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

const UIImage = styled.div`
  padding-bottom: 58%;
  background-image: linear-gradient(to right bottom, rgb(150, 68, 113) 0%, rgb(244, 113, 117) 100%);
  border-radius: 1rem;
  margin-bottom: 1rem;
`;
const UIInfo = styled.div`
  text-align: center;
`;

const UIMembers = styled.div``;
