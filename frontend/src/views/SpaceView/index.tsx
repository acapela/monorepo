import styled from "styled-components";
import { slugify } from "~shared/slugify";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { isCurrentUserSpaceMember, useSingleSpaceQuery } from "~frontend/gql/spaces";
import { routes } from "~frontend/routes";
import { SpaceCard } from "~frontend/ui/spaces/SpaceCard";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { Container } from "~ui/layout/Container";
import { PageTitle } from "~ui/typo";
import { SpaceRooms } from "./SpaceRooms";
import { useRef } from "react";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { getRoomDefaultDeadline } from "~frontend/utils/room";

interface Props {
  spaceId: string;
}

export function SpaceView({ spaceId }: Props) {
  const [space] = useSingleSpaceQuery({ id: spaceId });
  const amIMember = isCurrentUserSpaceMember(space ?? undefined);

  const rooms = space?.rooms ?? [];

  const [createRoom] = useCreateRoomMutation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function onCreate() {
    const roomName = await openUIPrompt({
      title: "Room name",
      placeholder: "Daily standup...",
      submitLabel: "Create room",
      anchor: {
        ref: buttonRef,
        placement: "bottom-end",
      },
      validateInput: createLengthValidator("Room name", 3),
    });

    if (!roomName?.trim()) {
      return;
    }

    const slug = slugify(roomName);

    const [room] = await createRoom({ name: roomName, spaceId, deadline: getRoomDefaultDeadline(), slug });

    const roomId = room?.id;

    if (!roomId) {
      return;
    }

    routes.spaceRoom.push({ spaceId, roomId });
  }

  return (
    <>
      <Container>
        <UIHolder>
          <UISpace>{space && <SpaceCard space={space} />}</UISpace>
          <UIContent>
            <UITitle>
              <PageTitle>Rooms</PageTitle>

              <Button
                ref={buttonRef}
                onClick={onCreate}
                isDisabled={!amIMember && { reason: `You have to be space member to add new room` }}
              >
                Create room
              </Button>
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
