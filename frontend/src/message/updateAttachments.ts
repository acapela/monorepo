import { attachmentEntity } from "~frontend/clientdb/attachment";
import { MessageEntity } from "~frontend/clientdb/message";

import { EditorAttachmentInfo } from "./composer/attachments";

export function updateMessageAttachments(message: MessageEntity, attachmentsDrafts: EditorAttachmentInfo[]) {
  const attachmentsToAdd = attachmentsDrafts.filter(
    (attachmentNow) => !message.attachments.findById(attachmentNow.uuid)
  );

  for (const { uuid } of attachmentsToAdd) {
    message.db.getEntity(attachmentEntity).findById(uuid)?.update({ message_id: message.id });
  }

  const existingAttachmentsToRemove = message.attachments.query(
    (existingMessageAttachment) =>
      !attachmentsDrafts.some((attachmentNow) => attachmentNow.uuid === existingMessageAttachment.id)
  ).all;

  for (const attachment of existingAttachmentsToRemove) {
    attachment.remove();
  }
}
