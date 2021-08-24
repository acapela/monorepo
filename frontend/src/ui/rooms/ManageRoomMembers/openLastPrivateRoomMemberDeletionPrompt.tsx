import { gql } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { routes } from "~frontend/router";
import { WarningModal } from "~frontend/utils/warningModal";
import { DeleteRoomMutationVariables, PrivateRoomDeletionPrompt_RoomFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";

type PromptResult = void;

const fragments = {
  room: gql`
    fragment PrivateRoomDeletionPrompt_room on room {
      id
      space_id
    }
  `,
};

type Props = {
  room: PrivateRoomDeletionPrompt_RoomFragment;
  onDeleteRoom: (variables: DeleteRoomMutationVariables) => void;
};

export const openLastPrivateRoomMemberDeletionPrompt = withFragments(
  fragments,
  createPromiseUI<Props, PromptResult>(({ room, onDeleteRoom }, resolve) => {
    const [isDeletingRoom, { set: setRoomOngoingDeletion }] = useBoolean(false);

    function handleCancel() {
      if (!isDeletingRoom) {
        resolve();
      }
    }

    async function handleDeleteRoom() {
      setRoomOngoingDeletion();

      await onDeleteRoom({ id: room.id });
      await routes.space.push({ spaceId: room.space_id });

      trackEvent("Deleted Room", { roomId: room.id });

      resolve();
    }

    return (
      <WarningModal
        title={"This private room will be deleted"}
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
  })
);

const UIActionButtons = styled.div<{}>`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;
