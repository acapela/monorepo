import { gql, useMutation } from "@apollo/client";

import { RoomBasicInfoFragment } from "~frontend/gql/rooms";
import { routes } from "~frontend/router";
import { ModalAnchor } from "~frontend/ui/Modal";
import { openUIPrompt } from "~frontend/utils/prompt";
import { getUUID } from "~shared/uuid";
import { createLengthValidator } from "~shared/validation/inputValidation";

interface CreateTopicInput {
  topicId?: string;
  roomId: string;
  ownerId: string;
  modalAnchor?: ModalAnchor;
  navigateAfterCreation?: boolean;
  index: string;
  name?: string;
  slug?: string;
}

export function useStartCreateNewTopicFlow() {
  const [createTopic] = useMutation(gql`
    mutation CreateTopic($input: topic_insert_input!) {
      topic: insert_topic_one(object: $input) {
        id
      }
    }
  `);

  return async function startCreateNewTopicFlow({
    topicId = getUUID(),
    roomId,
    ownerId,
    modalAnchor,
    navigateAfterCreation,
    index,
    name,
    slug,
  }: CreateTopicInput) {
    let topicName: string | null = name ?? null;

    if (topicName === null) {
      topicName = await openUIPrompt({
        title: "New topic name",
        submitLabel: "Create topic",
        placeholder: "eg. Our brand colors",
        anchor: modalAnchor,
        validateInput: createLengthValidator("Topic name", 3),
      });
    }

    if (!topicName?.trim()) {
      return;
    }

    const createTopicPromise = createTopic({
      variables: {
        input: {
          id: topicId,
          name: topicName,
          slug,
          index,
          room_id: roomId,
          owner_id: ownerId,
        },
      },
    });

    const room = RoomBasicInfoFragment.read(roomId);

    if (navigateAfterCreation && room) {
      routes.spaceRoomTopic.push({ topicId, spaceId: room.space_id, roomId: room.id });
    }

    const { data } = await createTopicPromise;
    return !!data;
  };
}
