import React from "react";
import { routes } from "~frontend/routes";
import { createRoom } from "~frontend/gql/rooms";
import { openRoomInputPrompt } from "~frontend/rooms/create/openRoomInputPrompt";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare } from "~ui/icons/default";

export const CreateRoomButton = () => {
  async function handleCreate() {
    const createRoomInput = await openRoomInputPrompt({});

    if (createRoomInput === null) {
      return;
    }

    const [room] = await createRoom({
      input: {
        name: createRoomInput.name,
        deadline: createRoomInput.deadline?.toISOString(),
        space_id: createRoomInput.spaceId,
      },
    });

    if (!room) return;

    routes.spaceRoom.push({ spaceId: room.space_id, roomId: room.id });
  }

  return (
    <>
      <Button iconPosition="start" icon={<IconPlusSquare />} onClick={handleCreate} size="large">
        New Room
      </Button>
    </>
  );
};
