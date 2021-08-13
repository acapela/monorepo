import React from "react";
import { routes } from "~frontend/router";
import { createRoom } from "~frontend/gql/rooms";
import { openRoomInputPrompt } from "~frontend/rooms/create/openRoomInputPrompt";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare } from "~ui/icons/default";
import styled from "styled-components";
import { getUUID } from "~shared/uuid";
import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";

type Props = {
  className?: string;
  buttonProps?: React.ComponentProps<typeof Button>;
  promptProps?: Parameters<typeof openRoomInputPrompt>[0];
};

export const CreateRoomButton = styled(function CreateRoomButton({ className, buttonProps, promptProps }: Props) {
  const user = useAssertCurrentUser();

  async function handleCreate() {
    const createRoomInput = await openRoomInputPrompt(promptProps ?? {});

    if (createRoomInput === null) {
      return;
    }

    const roomId = getUUID();
    const initialMembers = { data: createRoomInput.participantsIds.map((id) => ({ user_id: id })) };

    createRoom({
      input: {
        id: roomId,
        name: createRoomInput.name,
        deadline: createRoomInput.deadline?.toISOString(),
        space_id: createRoomInput.spaceId,
        members: initialMembers,
        owner_id: user.id,
      },
    });
    trackEvent("Created Room", {
      roomId,
      roomName: createRoomInput.name,
      roomDeadline: createRoomInput.deadline,
      spaceId: createRoomInput.spaceId,
      numberOfInitialMembers: initialMembers.data.length,
      isCalendarEvent: false,
    });
    routes.spaceRoom.push({ spaceId: createRoomInput.spaceId, roomId });
  }

  return (
    <Button
      className={className}
      {...buttonProps}
      iconPosition="start"
      icon={<IconPlusSquare />}
      onClick={handleCreate}
    >
      New Room
    </Button>
  );
})``;
