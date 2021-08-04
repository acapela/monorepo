import React from "react";
import { routes } from "~frontend/router";
import { createRoom } from "~frontend/gql/rooms";
import { openRoomInputPrompt } from "~frontend/rooms/create/openRoomInputPrompt";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare } from "~ui/icons/default";
import styled from "styled-components";
import { getUUID } from "~shared/uuid";

type Props = React.ComponentProps<typeof Button>;

export const CreateRoomButton = styled(function CreateRoomButton(props: Props) {
  async function handleCreate() {
    const createRoomInput = await openRoomInputPrompt({});

    if (createRoomInput === null) {
      return;
    }

    const roomId = getUUID();

    createRoom({
      input: {
        id: roomId,
        name: createRoomInput.name,
        deadline: createRoomInput.deadline?.toISOString(),
        space_id: createRoomInput.spaceId,
        members: { data: createRoomInput.participantsIds.map((id) => ({ user_id: id })) },
      },
    });

    routes.spaceRoom.push({ spaceId: createRoomInput.spaceId, roomId });
  }

  return (
    <>
      <Button {...props} iconPosition="start" icon={<IconPlusSquare />} onClick={handleCreate}>
        New Room
      </Button>
    </>
  );
})``;
