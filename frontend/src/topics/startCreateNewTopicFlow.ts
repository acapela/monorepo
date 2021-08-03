import { createLengthValidator } from "~shared/validation/inputValidation";
import { createTopic } from "~frontend/gql/topics";
import { createLastItemIndex } from "~frontend/rooms/order";
import { routes } from "~frontend/routes";
import { ModalAnchor } from "~frontend/ui/Modal";
import { openUIPrompt } from "~frontend/utils/prompt";
import { getUUID } from "~shared/uuid";
import { RoomBasicInfoFragment } from "~frontend/gql/rooms";

interface CreateTopicInput {
  roomId: string;
  modalAnchor?: ModalAnchor;
  navigateAfterCreation?: boolean;
  currentLastIndex?: string;
  name?: string;
  slug?: string;
}

export async function startCreateNewTopicFlow({
  roomId,
  modalAnchor,
  navigateAfterCreation,
  currentLastIndex,
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

  const index = createLastItemIndex(currentLastIndex);

  const topicId = getUUID();

  const createTopicPromise = createTopic({
    input: {
      id: topicId,
      name: topicName,
      slug,
      index,
      room_id: roomId,
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
