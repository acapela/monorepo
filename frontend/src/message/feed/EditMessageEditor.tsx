import { Editor } from "@tiptap/react";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { TaskEntity } from "~frontend/clientdb/task";
import { MessageContentEditor } from "~frontend/message/composer/MessageContentComposer";
import { MessageTools } from "~frontend/message/composer/Tools";
import { useMessageEditorManager } from "~frontend/message/composer/useMessageEditorManager";
import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { EditorMentionData } from "~shared/types/editor";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

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

  const {
    content,
    setContent,
    uploadAttachments,
    uploadingAttachments,
    attachments,
    removeAttachmentById,
    isEmptyWithNoAttachments,
    clearPersistedContent,
  } = useMessageEditorManager({
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

    const mentionData = getUniqueRequestMentionDataFromContent(content);

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

    clearPersistedContent();
    onSaved?.();
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
          <Button
            kind="primary"
            isDisabled={isEmptyWithNoAttachments}
            onClick={handleSubmit}
            shortcut={["Mod", "Enter"]}
          >
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
  ${theme.spacing.actionsSection.asGap};
`;

const UIActions = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${theme.spacing.actionsSection.asGap};
`;

const UIButtons = styled.div`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};
`;
