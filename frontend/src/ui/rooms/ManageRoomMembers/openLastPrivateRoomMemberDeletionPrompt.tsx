import React from "react";
import styled from "styled-components";
import { routes } from "~frontend/router";
import { deleteRoom } from "~frontend/gql/rooms";
import { ModalAnchor } from "~frontend/ui/Modal";
import { WarningModal } from "~frontend/utils/warningModal";
import { RoomBasicInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { createPromiseUI } from "~ui/createPromiseUI";
import { Button } from "~ui/buttons/Button";

interface PromptInput {
  room: RoomBasicInfoFragment;
  anchor?: ModalAnchor;
}

type PromptResult = void;

export const openLastPrivateRoomMemberDeletionPrompt = createPromiseUI<PromptInput, PromptResult>(
  ({ anchor, room }, resolve) => {
    const [isDeletingRoom, { set: setRoomOngoingDeletion }] = useBoolean(false);

    function handleCancel() {
      if (!isDeletingRoom) {
        resolve();
      }
    }

    async function handleDeleteRoom() {
      setRoomOngoingDeletion();

      await routes.space.push({ spaceId: room.space_id });

      await deleteRoom({ roomId: room.id });

      resolve();
    }

    return (
      <WarningModal
        title={"This private room will be deleted"}
        anchor={anchor}
        description={
          "If you'd like to leave without deleting this room, you can either make the room public or keep the room private with at least 1 participant."
        }
        onCloseRequest={handleCancel}
        hasCloseButton={true}
      >
        <UIActionButtons>
          <Button isDisabled={isDeletingRoom} onClick={handleDeleteRoom}>
            Leave and Delete room
          </Button>
          <Button kind="transparent" isDisabled={isDeletingRoom} onClick={handleCancel}>
            Cancel
          </Button>
        </UIActionButtons>
      </WarningModal>
    );
  }
);

const UIActionButtons = styled.div<{}>`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;
