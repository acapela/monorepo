import styled from "styled-components";
import { PageTitle } from "~ui/typo";
import { useGetSingleSpaceQuery } from "~frontend/gql/spaces";
import { SpaceCard } from "~frontend/ui/spaces/SpaceCard";
import { SpaceRooms } from "./SpaceRooms";
import { Button } from "~ui/button";
import { useCreateRoomMutation } from "~frontend/gql/rooms";

import { routes } from "~frontend/routes";

interface Props {
  spaceId: string;
}

export function SpaceView({ spaceId }: Props) {
  const { data } = useGetSingleSpaceQuery.subscription({ id: spaceId });

  const [createRoom] = useCreateRoomMutation();

  const space = data?.space ?? null;

  const rooms = space?.rooms ?? [];

  async function handleCreateRoom() {
    const name = window.prompt("Room name?");

    if (!name?.trim()) return;

    await createRoom({ name, spaceId });
  }

  return (
    <UIHolder>
      <UISpace>{space && <SpaceCard space={space} />}</UISpace>
      <UIContent>
        <UITitle>
          <PageTitle>Rooms</PageTitle>
          <Button onClick={handleCreateRoom}>Create room</Button>
        </UITitle>

        <UIRoom>
          <SpaceRooms rooms={rooms} />
        </UIRoom>
      </UIContent>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-gap: 2rem;
`;

const UISpace = styled.div``;

const UIContent = styled.div``;

const UITitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UIRoom = styled.div``;
