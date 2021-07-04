import React from "react";
import styled from "styled-components";
import { routes } from "~frontend/routes";
import { deleteRoom } from "~frontend/gql/rooms";
import { ModalAnchor } from "~frontend/ui/Modal";
import { WarningModal } from "~frontend/utils/warningModal";
import { RoomBasicInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { TransparentButton } from "~ui/buttons/TransparentButton";
import { createPromiseUI } from "~ui/createPromiseUI";
import { useShortcut } from "~ui/keyboard/useShortcut";

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

    useShortcut("Escape", handleCancel);

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
          <UIDeleteButton isDisabled={isDeletingRoom} onClick={handleDeleteRoom}>
            Leave and Delete room
          </UIDeleteButton>
          <UICloseButton isDisabled={isDeletingRoom} onClick={handleCancel}>
            Cancel
          </UICloseButton>
        </UIActionButtons>
      </WarningModal>
    );
  }
);

const UIDeleteButton = styled(Button)``;

const UICloseButton = styled(TransparentButton)``;

const UIActionButtons = styled.div`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;
