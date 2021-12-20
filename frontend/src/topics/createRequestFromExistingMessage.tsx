import { action } from "mobx";

import { ClientDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { TopicEntity } from "~frontend/clientdb/topic";
import { getMessageContentIncludesAnyRequests } from "~frontend/message/extractRequestsFromMessage";

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
  // TODO
}

export const createNewRequestFromExistingMessage = action(async (db: ClientDb, message: MessageEntity) => {
  const { content, attachments, decisionOptions, dueDate } = message;

  const priority = message.topic?.priority;

  if (!getMessageContentIncludesAnyRequests(content)) return;

  const { topic: newTopic, message: newMessage } = await createNewRequest({
    content,
    db,
    priority,
    tasksDueDate: dueDate ?? undefined,
  });

  moveAllMetadataBetweenMessages(message, newMessage);

  convertMessageContentToLinkToTopic(message, newTopic);
});
