import { Editor } from "@tiptap/react";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { theme } from "~frontend/../../ui/theme";
import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { TaskEntity } from "~frontend/clientdb/task";
import { useMessageEditorManager } from "~frontend/views/RequestView/TopicWithMessages/useMessageEditorManager";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { getUniqueMentionDataFromContent } from "~shared/editor/mentions";
import { EditorMentionData } from "~shared/types/editor";
import { Button } from "~ui/buttons/Button";
import { HStack } from "~ui/Stack";

import { MessageContentEditor } from "./MessageContentComposer";
import { MessageTools } from "./Tools";

interface Props {
  message: MessageEntity;
  onCancelRequest?: () => void;
  onSaved?: () => void;
}

const getIsMentionMatchingTask = ({ userId, type }: EditorMentionData, task: TaskEntity) =>
  task.user_id === userId && task.type === type;

export const EditMessageEditor = observer(({ message, onCancelRequest, onSaved }: Props) => {
  const db = useDb();
  const editorRef = useRef<Editor>(null);

  const { content, setContent, uploadAttachments, uploadingAttachments, attachments, removeAttachmentById } =
    useMessageEditorManager({
      editorRef,
      persistanceKey: "message-draft-for-message" + message.id,
      initialValue: message.content,
    });

  function handleSubmit() {
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

    const mentionData = getUniqueMentionDataFromContent(content);

    const unmentionedTasks = message.tasks.all.filter(
      (task) => !mentionData.some((mention) => getIsMentionMatchingTask(mention, task))
    );
    for (const task of unmentionedTasks) {
      db.task.removeById(task.id);
    }

    const newlyMentionedTasks = mentionData.filter(
      (node) => message.tasks.query((task) => getIsMentionMatchingTask(node, task)).all.length == 0
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
        onAttachmentRemoveRequest={removeAttachmentById}
        autofocusKey={message.id}
      />
      <UIActions>
        <MessageTools onFilesPicked={uploadAttachments} />
        <UIButtons>
          <Button kind="secondary" onClick={onCancelRequest} shortcut={"Esc"}>
            Cancel
          </Button>
          <Button kind="primary" isDisabled={!getCanSubmit()} onClick={handleSubmit} shortcut={["Mod", "Enter"]}>
            Save
          </Button>
        </UIButtons>
      </UIActions>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.horizontalActionsSection.asGap};
`;

const UIActions = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${theme.spacing.horizontalActionsSection.asGap};
`;

const UIButtons = styled.div`
  display: flex;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap};
`;
