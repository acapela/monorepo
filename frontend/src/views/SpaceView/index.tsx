import styled from "styled-components";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { routes } from "~frontend/routes";
import { CreateRoomModal } from "~frontend/ui/rooms/CreateRoomModal";
import { SpaceCard } from "~frontend/ui/spaces/SpaceCard";
import { Button } from "~ui/button";
import { Container } from "~ui/layout/Container";
import { PageTitle } from "~ui/typo";
import { SpaceRooms } from "./SpaceRooms";

interface Props {
  spaceId: string;
}

export function SpaceView({ spaceId }: Props) {
  const [data] = useSingleSpaceQuery.subscription({ id: spaceId });
  const [isCreatingRoom, { set: openCreateRoomModal, unset: closeCreateRoomModal }] = useBoolean(false);

  const space = data?.space ?? null;

  const rooms = space?.rooms ?? [];

  return (
    <>
      {isCreatingRoom && (
        <CreateRoomModal
          spaceId={spaceId}
          onCloseRequest={closeCreateRoomModal}
          onCreated={({ spaceId, roomId }) => routes.spaceRoom.push({ spaceId, roomId })}
        />
      )}
      <Container>
        <UIHolder>
          <UISpace>{space && <SpaceCard space={space} />}</UISpace>
          <UIContent>
            <UITitle>
              <PageTitle>Rooms</PageTitle>
              <Button onClick={openCreateRoomModal}>Create room</Button>
            </UITitle>

            <UIRoom>
              <SpaceRooms rooms={rooms} />
            </UIRoom>
          </UIContent>
        </UIHolder>
      </Container>
    </>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-gap: 4rem;
`;

const UISpace = styled.div``;

const UIContent = styled.div``;

const UITitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const UIRoom = styled.div``;
