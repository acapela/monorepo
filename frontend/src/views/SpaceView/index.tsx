import styled from "styled-components";
import { PageTitle } from "~ui/typo";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { SpaceCard } from "~frontend/ui/spaces/SpaceCard";
import { SpaceRooms } from "./SpaceRooms";
import { Button } from "~ui/button";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { slugify } from "~shared/slugify";
import { Container } from "~ui/layout/Container";
import { routes } from "~frontend/routes";

interface Props {
  spaceId: string;
}

export function SpaceView({ spaceId }: Props) {
  const [data] = useSingleSpaceQuery.subscription({ id: spaceId });

  const [createRoom] = useCreateRoomMutation();

  const space = data?.space ?? null;

  const rooms = space?.rooms ?? [];

  async function handleCreateRoom() {
    const name = window.prompt("Room name?");

    if (!name?.trim()) return;

    const slug = slugify(name);

    const { data: createRoomResult } = await createRoom({ name, spaceId, slug });

    const roomId = createRoomResult?.room?.id;

    if (!roomId) return;

    routes.spaceRoom.push({ roomId, spaceId });
  }

  return (
    <Container>
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
    </Container>
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
  margin-bottom: 2rem;
`;

const UIRoom = styled.div``;
