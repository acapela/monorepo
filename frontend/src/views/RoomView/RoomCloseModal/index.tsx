import React, { useState } from "react";

import { createPromiseUI } from "~frontend/../../ui/createPromiseUI";

import { RoomBasicInfoFragment } from "~frontend/gql";
import { Modal } from "~frontend/ui/Modal";
import { useRoomTopicList } from "~frontend/rooms/useRoomTopicList";
import { useCloseOpenTopicsMutation } from "~frontend/gql/rooms";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { CloseOpenTopicsDialog } from "./CloseOpenTopicsDialog";
import styled from "styled-components";
import { TopicDetailedInfoFragment } from "~frontend/gql";

interface RoomCloseModalInput {
  room: RoomBasicInfoFragment;
}

type RoomCloseModalResult = boolean;

export const roomCloseModal = createPromiseUI<RoomCloseModalInput, RoomCloseModalResult>(({ room }, resolve) => {
  const { topics } = useRoomTopicList(room.id);
  const { id: closedByUserId } = useAssertCurrentUser();

  const [closeOpenTopics, { loading: isClosingOpenTopics }] = useCloseOpenTopicsMutation();

  const [recentlyClosedTopics, setRecentlyClosedTopics] = useState<TopicDetailedInfoFragment[]>([]);

  async function handleCloseAllOpenTopics() {
    await closeOpenTopics({
      roomId: room.id,
      closedAt: new Date().toISOString(),
      closedByUserId,
    });
    setRecentlyClosedTopics(openTopics);
  }

  const openTopics = topics.filter((topic) => !topic.closed_at);
  if (openTopics.length > 0) {
    return (
      <CloseOpenTopicsDialog
        openTopics={openTopics}
        isLoading={isClosingOpenTopics}
        onConfirmation={handleCloseAllOpenTopics}
        onCloseRequest={() => resolve(false)}
      />
    );
  }

  // TODO: Decide with designers if this modal is even needed at all
  return <UIModal onCloseRequest={() => resolve(false)}>Your team closed all of the topics in this room</UIModal>;
});

const UIModal = styled(Modal)`
  background-color: hsla(0, 0%, 96%, 1);
`;
