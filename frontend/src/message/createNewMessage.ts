import { action } from "mobx";

import { MessageEntity, messageEntity } from "~frontend/clientdb/message";
import { TopicEntity } from "~frontend/clientdb/topic";
import { EditorAttachmentInfo } from "~frontend/message/composer/attachments";
import { DecisionOptionDraft, createDecisionsForMessage } from "~frontend/message/decisions";
import { updateMessageAttachments } from "~frontend/message/updateAttachments";
import { Message_Type_Enum } from "~gql";
import { RichEditorNode } from "~richEditor/content/types";

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: RichEditorNode;
  attachments?: EditorAttachmentInfo[];
  topic: TopicEntity;
  decisionOptions?: DecisionOptionDraft[];
  replyToMessageId?: string;
}

export const createMessageAndAttachMeta = action((params: SubmitMessageParams) => {
  const { type, content, attachments, topic, decisionOptions, replyToMessageId } = params;
  const newMessage = topic.db.getEntity(messageEntity).create({
    topic_id: topic.id,
    type,
    content,
    replied_to_message_id: replyToMessageId,
  });

  updateMessageAttachments(newMessage, attachments ?? []);

  // TODO removed ones
  createDecisionsForMessage(newMessage, decisionOptions ?? []);

  return newMessage;
});

interface EditMessageParams {
  newContent: RichEditorNode;
  attachments?: EditorAttachmentInfo[];
  decisionOptions?: DecisionOptionDraft[];
}

export const updateMessageAndMeta = action(
  (message: MessageEntity, { newContent, attachments, decisionOptions }: EditMessageParams) => {
    message.update({ content: newContent });

    updateMessageAttachments(message, attachments ?? []);

    // TODO removed ones
    createDecisionsForMessage(message, decisionOptions ?? []);
  }
);
