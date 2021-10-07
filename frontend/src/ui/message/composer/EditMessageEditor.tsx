import { observer } from "mobx-react";
import React from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { bindAttachmentsToMessage, removeAttachment } from "~frontend/gql/attachments";
import {
  MentionTaskDraftsContext,
  getTaskIdsFromContentMentions,
  useStoredContentAndTasks,
} from "~frontend/message/content-and-task-drafts";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
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

  const { content, taskDrafts, mentionTasksContextValue, setContentAndUpdateTasks } = useStoredContentAndTasks(message);

  useShortcut("Escape", onCancelRequest);
  useShortcut("Enter", () => {
    handleSubmit();

    // Don't pass enter to editor as it would insert new line
    return true;
  });

  async function handleSubmit() {
    const attachmentsToAdd = attachments.filter((attachmentNow) => !message.attachments.findById(attachmentNow.uuid));

    const existingAttachmentsToRemove = message.attachments.query(
      (existingMessageAttachment) =>
        !attachments.some((attachmentNow) => attachmentNow.uuid === existingMessageAttachment.id)
    ).all;

    const addAttachmentsPromises = bindAttachmentsToMessage(
      message.id,
      attachmentsToAdd.map(({ uuid }) => uuid)
    );

    const removingAttachmentsPromises = existingAttachmentsToRemove.map(async (attachmentToRemove) => {
      await removeAttachment({ id: attachmentToRemove.id });
    });

    message.update({ content });

    const mentionedTaskIds = getTaskIdsFromContentMentions(content);

    for (const task of message.tasks.all.filter((task) => !mentionedTaskIds.has(task.id))) {
      db.task.removeById(task.id);
    }

    for (const taskDraft of taskDrafts.filter((draft) => mentionedTaskIds.has(draft.id))) {
      db.task.create({
        id: taskDraft.id,
        message_id: message.id,
        user_id: taskDraft.userId,
        type: taskDraft.type,
      });
    }

    await Promise.all([...addAttachmentsPromises, ...removingAttachmentsPromises]);
    trackEvent("Edited Message", { messageId: message.id });
    onSaved?.();
  }

  function getCanSubmit() {
    if (attachments.length > 0) return true;

    return !isRichEditorContentEmpty(content);
  }

  return (
    <UIHolder>
      <MentionTaskDraftsContext.Provider value={mentionTasksContextValue}>
        <MessageContentEditor
          content={content}
          onContentChange={setContentAndUpdateTasks}
          onFilesSelected={uploadAttachments}
          uploadingAttachments={uploadingAttachments}
          attachments={attachments}
          onAttachmentRemoveRequest={(attachmentId) => {
            attachmentsList.filter((existingAttachment) => {
              return existingAttachment.uuid !== attachmentId;
            });
          }}
          autofocusKey={message.id}
          hideEditorSubmitButton
        />
      </MentionTaskDraftsContext.Provider>
      <UIButtons gap={8} justifyContent="end">
        <Button kind="transparent" onClick={onCancelRequest}>
          Cancel
        </Button>
        <Button isDisabled={!getCanSubmit()} onClick={handleSubmit}>
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
