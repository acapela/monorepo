import React from "react";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Modal, ModalAnchor } from "~frontend/ui/Modal";
import { PageTitle } from "~ui/typo";
import { SECONDARY_ORANGE_1 } from "~ui/colors";
import { TransparentButton } from "~ui/buttons/TransparentButton";
import { routes } from "~frontend/../routes";
import { deleteRoom } from "~frontend/gql/rooms";
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { RoomBasicInfoFragment } from "~frontend/../../gql";

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
      <Modal anchor={anchor} onCloseRequest={handleCancel}>
        <UIContentWrapper>
          <UIHeader>
            <UIWarningHeader>One Sec!</UIWarningHeader>
            <UIWarningTitle>This private room will be deleted </UIWarningTitle>
          </UIHeader>
          <UIForbiddenAccessDescription>
            If you'd like to leave without deleting this room, you can either make the room public or keep the room
            private with at least 1 participant.
          </UIForbiddenAccessDescription>
          <UIActionButtons>
            <UIDeleteButton isDisabled={isDeletingRoom} onClick={handleDeleteRoom}>
              Leave and Delete room
            </UIDeleteButton>
            <UICloseButton isDisabled={isDeletingRoom} onClick={handleCancel}>
              Cancel
            </UICloseButton>
          </UIActionButtons>
        </UIContentWrapper>
      </Modal>
    );
  }
);

const UIContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;

  max-width: 480px;
`;

const UIHeader = styled.div`
  padding: 0 24px;
`;

const UIWarningHeader = styled(PageTitle)`
  padding-bottom: 8px;
  color: ${SECONDARY_ORANGE_1};
`;

const UIWarningTitle = styled(PageTitle)``;

const UIForbiddenAccessDescription = styled.p`
  line-height: 1.5;
  padding-bottom: 8px;
`;

const UIDeleteButton = styled(Button)``;

const UICloseButton = styled(TransparentButton)``;

const UIActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;
