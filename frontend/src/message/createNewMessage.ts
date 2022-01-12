import { action } from "mobx";

import { MessageEntity, messageEntity } from "@aca/frontend/clientdb/message";
import { TopicEntity } from "@aca/frontend/clientdb/topic";
import { EditorAttachmentInfo } from "@aca/frontend/message/composer/attachments";
import { DecisionOptionDraft, createDecisionsForMessage } from "@aca/frontend/message/decisions";
import { updateMessageAttachments } from "@aca/frontend/message/updateAttachments";
import { getSingleRequestTypeIfSameForManyUsers } from "@aca/frontend/tasks/single-completion";
import { Message_Type_Enum } from "@aca/gql";
import { RichEditorNode } from "@aca/richEditor/content/types";

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: RichEditorNode;
  attachments?: EditorAttachmentInfo[];
  topic: TopicEntity;
  decisionOptions?: DecisionOptionDraft[];
  replyToMessageId?: string;
  isFirstCompletionEnough: boolean;
}

export const createMessageAndAttachMeta = action((params: SubmitMessageParams) => {
  const { type, content, attachments, topic, decisionOptions, replyToMessageId } = params;
  const newMessage = topic.db.getEntity(messageEntity).create({
    topic_id: topic.id,
    type,
    content,
    replied_to_message_id: replyToMessageId,
    is_first_completion_enough: params.isFirstCompletionEnough,
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
    message.update({
      content: newContent,
      is_first_completion_enough:
        message.is_first_completion_enough && !!getSingleRequestTypeIfSameForManyUsers(newContent),
    });

    updateMessageAttachments(message, attachments ?? []);

    // TODO removed ones
    createDecisionsForMessage(message, decisionOptions ?? []);
  }
);
