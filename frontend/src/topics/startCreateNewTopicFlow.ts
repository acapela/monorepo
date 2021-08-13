import { createLengthValidator } from "~shared/validation/inputValidation";
import { createTopic } from "~frontend/gql/topics";
import { routes } from "~frontend/router";
import { ModalAnchor } from "~frontend/ui/Modal";
import { openUIPrompt } from "~frontend/utils/prompt";
import { getUUID } from "~shared/uuid";
import { RoomBasicInfoFragment } from "~frontend/gql/rooms";

interface CreateTopicInput {
  roomId: string;
  ownerId: string;
  modalAnchor?: ModalAnchor;
  navigateAfterCreation?: boolean;
  index: string;
  name?: string;
  slug?: string;
}

export async function startCreateNewTopicFlow({
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

  const topicId = getUUID();

  const createTopicPromise = createTopic({
    input: {
      id: topicId,
      name: topicName,
      slug,
      index,
      room_id: roomId,
      owner_id: ownerId,
    },
  });

  const room = RoomBasicInfoFragment.read(roomId);

  if (navigateAfterCreation && room) {
    routes.spaceRoomTopic.push({ topicId, spaceId: room.space_id, roomId: room.id });
  }

  const [topic] = await createTopicPromise;

  if (!topic) {
    return;
  }

  return topic;
}
