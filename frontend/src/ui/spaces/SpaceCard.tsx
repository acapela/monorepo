import styled from "styled-components";
import { ItemTitle } from "~ui/typo";
import { SpaceBasicInfoFragment } from "~frontend/gql";
import { useRouter } from "next/router";
import { AvatarList } from "../AvatarList";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useAddSpaceMember, useRemoveSpaceMember } from "~frontend/gql/spaces";
import { Button } from "~ui/button";

interface Props {
  space: SpaceBasicInfoFragment;
}

export function SpaceCard({ space }: Props) {
  const spaceId = space.id;
  const user = useAssertCurrentUser();
  const router = useRouter();

  const [addSpaceMember] = useAddSpaceMember();
  const [removeSpaceMember] = useRemoveSpaceMember();

  async function handleJoin() {
    await addSpaceMember({ userId: user.id, spaceId });
  }

  async function handleLeave() {
    await removeSpaceMember({ userId: user.id, spaceId });
  }

  function getIsMember() {
    return space.members.some((member) => member.user.id === user?.id);
  }

  const isMember = getIsMember();

  function handleOpen() {
    router.push(`space/${space.id}`);
  }

  return (
    <UIHolder>
      <UIImage onClick={handleOpen}></UIImage>
      <UIInfo>
        <ItemTitle onClick={handleOpen}>{space.name}</ItemTitle>
        <UIMembers>
          <AvatarList users={space.members.map((m) => m.user)} />
        </UIMembers>
        {!isMember && <Button onClick={handleJoin}>Join</Button>}
        {isMember && <Button onClick={handleLeave}>Leave</Button>}
      </UIInfo>
    </UIHolder>
  );
}

const UIHolder = styled.div``;

const UIImage = styled.div`
  padding-bottom: 58%;
  background-color: #fccedd;
  border-radius: 1rem;
  margin-bottom: 1rem;
`;
const UIInfo = styled.div`
  text-align: center;
`;

const UIMembers = styled.div``;
