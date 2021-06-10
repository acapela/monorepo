import { createLengthValidator } from "~shared/validation/inputValidation";
import { createTopic } from "~frontend/gql/topics";
import { createLastItemIndex } from "~frontend/rooms/order";
import { routes } from "~frontend/routes";
import { ModalAnchor } from "~frontend/ui/Modal";
import { openUIPrompt } from "~frontend/utils/prompt";
import { slugify } from "~shared/slugify";

interface CreateTopicInput {
  roomId: string;
  modalAnchor?: ModalAnchor;
  navigateAfterCreation?: boolean;
  currentLastIndex?: string;
}

export async function startCreateNewTopicFlow({
  roomId,
  modalAnchor,
  navigateAfterCreation,
  currentLastIndex,
}: CreateTopicInput) {
  const topicName = await openUIPrompt({
    title: "New topic name",
    submitLabel: "Create topic",
    placeholder: "eg. Our brand colors",
    anchor: modalAnchor,
    validateInput: createLengthValidator("Topic name", 3),
  });

  if (!topicName?.trim()) {
    return;
  }

  const index = createLastItemIndex(currentLastIndex);
  const slug = slugify(topicName);

  const { data: createTopicResult } = await createTopic({
    name: topicName,
    slug,
    index,
    roomId,
  });

  const topic = createTopicResult?.topic;

  if (!topic) {
    return;
  }

  if (navigateAfterCreation) {
    routes.spaceRoomTopic.push({ topicId: topic.id, spaceId: topic.room.space_id, roomId: topic.room.id });
  }

  return topic;
}
