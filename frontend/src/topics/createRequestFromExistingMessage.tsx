import { action, runInAction } from "mobx";

import { MessageEntity } from "~frontend/clientdb/message";
import { TopicEntity } from "~frontend/clientdb/topic";
import { getMessageContentIncludesAnyRequests } from "~frontend/message/extractRequestsFromMessage";
import { createRichEditorTextNode, getNewRichContentWithNodes } from "~richEditor/content/helper";
import { EditorRequestLinkNode } from "~shared/types/editor";

import { createNewRequest } from "./createRequest";

function moveAttachmentsBetweenMessages(source: MessageEntity, destination: MessageEntity) {
  source.attachments.all.forEach((attachment) => {
    attachment.update({ message_id: destination.id });
  });
}

function moveDecisionOptionsBetweenMessages(source: MessageEntity, destination: MessageEntity) {
  source.decisionOptions.all.forEach((decisionOption) => {
    decisionOption.update({ message_id: destination.id });
  });
}

/**
 * Note: this should not include tasks, those are derieved from content and automatically created
 */
function moveAllMetadataBetweenMessages(source: MessageEntity, destination: MessageEntity) {
  moveAttachmentsBetweenMessages(source, destination);
  moveDecisionOptionsBetweenMessages(source, destination);
}

function convertMessageContentToLinkToTopic(message: MessageEntity, topicToLink: TopicEntity) {
  const node: EditorRequestLinkNode = {
    type: "request-link",
    attrs: { data: { requestId: topicToLink.id, originalTopicName: topicToLink.name } },
    text: "Foo",
  };

  const newContentWithLinkOnly = getNewRichContentWithNodes([
    createRichEditorTextNode("Discussion continued in: "),
    node,
  ]);

  message.update({ content: newContentWithLinkOnly });
}

export const createNewRequestFromExistingMessage = action(async (message: MessageEntity) => {
  const { content, dueDate } = message;

  const priority = message.topic?.priority;

  if (!getMessageContentIncludesAnyRequests(content)) return;

  const { topic: newTopic, message: newMessage } = await createNewRequest({
    content,
    db: message.db,
    priority,
    tasksDueDate: dueDate ?? undefined,
  });

  runInAction(() => {
    moveAllMetadataBetweenMessages(message, newMessage);
    convertMessageContentToLinkToTopic(message, newTopic);
  });

  return newTopic;
});
