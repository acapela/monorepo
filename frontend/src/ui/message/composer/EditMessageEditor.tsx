import { observer } from "mobx-react";
import React from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { TaskEntity } from "~frontend/clientdb/task";
import { useLocalStorageState } from "~frontend/hooks/useLocalStorageState";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichEditorNode } from "~richEditor/content/types";
import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { EditorMentionData } from "~shared/types/editor";
import { Button } from "~ui/buttons/Button";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { HStack } from "~ui/Stack";

import { EditorAttachmentInfo } from "./attachments";
import { MessageContentEditor } from "./MessageContentComposer";

interface Props {
  message: MessageEntity;
  onCancelRequest?: () => void;
  onSaved?: () => void;
}

const isMentioningTask = ({ userId, type }: EditorMentionData, task: TaskEntity) =>
  task.user_id === userId && task.type === type;

export const EditMessageEditor = observer(({ message, onCancelRequest, onSaved }: Props) => {
  const db = useDb();

  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>(
    message.attachments.all.map((messageAttachment) => ({
      mimeType: messageAttachment.mime_type,
      uuid: messageAttachment.id,
    }))
  );
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

  const [content, setContent] = useLocalStorageState<RichEditorNode>({
    key: "message-draft-for-message" + message.id,
    initialValue: message.content,
  });

  useShortcut("Escape", onCancelRequest);
  useShortcut("Enter", () => {
    handleSubmit();

    // Don't pass enter to editor as it would insert new line
    return true;
  });

  async function handleSubmit() {
    const attachmentsToAdd = attachments.filter((attachmentNow) => !message.attachments.findById(attachmentNow.uuid));

    for (const { uuid } of attachmentsToAdd) {
      db.attachment.findById(uuid)?.update({ message_id: message.id });
    }

    const existingAttachmentsToRemove = message.attachments.query(
      (existingMessageAttachment) =>
        !attachments.some((attachmentNow) => attachmentNow.uuid === existingMessageAttachment.id)
    ).all;

    for (const attachment of existingAttachmentsToRemove) {
      attachment.remove();
    }

    message.update({ content });

    const mentionData = getUniqueRequestMentionDataFromContent(content);

    const unmentionedTasks = message.tasks.all.filter(
      (task) => !mentionData.some((mention) => isMentioningTask(mention, task))
    );
    for (const task of unmentionedTasks) {
      db.task.removeById(task.id);
    }

    const newlyMentionedTasks = mentionData.filter(
      (node) => message.tasks.query((task) => isMentioningTask(node, task)).all.length == 0
    );
    for (const newMention of newlyMentionedTasks) {
      const { userId, type } = newMention;
      db.task.create({ message_id: message.id, user_id: userId, type });
    }

    trackEvent("Edited Message", { messageId: message.id });
    onSaved?.();
  }

  function getCanSubmit() {
    if (attachments.length > 0) return true;

    return !isRichEditorContentEmpty(content);
  }

  return (
    <UIHolder>
      <MessageContentEditor
        content={content}
        onContentChange={setContent}
        onFilesSelected={uploadAttachments}
        uploadingAttachments={uploadingAttachments}
        attachments={attachments}
        onAttachmentRemoveRequest={(attachmentId) => {
          attachmentsList.filter((existingAttachment) => {
            return existingAttachment.uuid !== attachmentId;
          });
        }}
        autofocusKey={message.id}
      />
      <UIButtons gap={8} justifyContent="end">
        <Button kind="secondary" onClick={onCancelRequest}>
          Cancel
        </Button>
        <Button kind="primary" isDisabled={!getCanSubmit()} onClick={handleSubmit}>
          Save
        </Button>
      </UIButtons>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>``;

const UIButtons = styled(HStack)<{}>`
  margin-top: 8px;
`;
