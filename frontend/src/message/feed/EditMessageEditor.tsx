import { Editor } from "@tiptap/react";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { MessageContentEditor } from "~frontend/message/composer/MessageContentComposer";
import { MessageTools } from "~frontend/message/composer/Tools";
import { useMessageEditorManager } from "~frontend/message/composer/useMessageEditorManager";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

import { updateMessageTasks } from "../updateMessageTasks";

interface Props {
  message: MessageEntity;
  onCancelRequest?: () => void;
  onSaved?: () => void;
}

export const EditMessageEditor = observer(({ message, onCancelRequest, onSaved }: Props) => {
  const db = useDb();
  const editorRef = useRef<Editor>(null);

  const {
    content,
    setContent,
    uploadAttachments,
    uploadingAttachments,
    attachmentsDrafts,
    removeAttachmentById,
    isEmptyWithNoAttachments,
    clearPersistedContent,
  } = useMessageEditorManager({
    editorRef,
    persistanceKey: "message-draft-for-message" + message.id,
    initialValue: message.content,
  });

  function handleSubmit() {
    const attachmentsToAdd = attachmentsDrafts.filter(
      (attachmentNow) => !message.attachments.findById(attachmentNow.uuid)
    );

    for (const { uuid } of attachmentsToAdd) {
      db.attachment.findById(uuid)?.update({ message_id: message.id });
    }

    const existingAttachmentsToRemove = message.attachments.query(
      (existingMessageAttachment) =>
        !attachmentsDrafts.some((attachmentNow) => attachmentNow.uuid === existingMessageAttachment.id)
    ).all;

    for (const attachment of existingAttachmentsToRemove) {
      attachment.remove();
    }

    const contentBefore = message.content;
    message.update({ content });

    updateMessageTasks(db, message, contentBefore);

    clearPersistedContent();
    onSaved?.();
  }

  return (
    <UIHolder>
      <UIEditorScroller>
        <MessageContentEditor
          content={content}
          onContentChange={setContent}
          onFilesSelected={uploadAttachments}
          uploadingAttachments={uploadingAttachments}
          attachmentDrafts={attachmentsDrafts}
          onAttachmentRemoveRequest={removeAttachmentById}
          autofocusKey={message.id}
          capturePastedFiles
        />
      </UIEditorScroller>

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

const UIEditorScroller = styled.div`
  max-height: 25vh;
  overflow-y: auto; ;
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
