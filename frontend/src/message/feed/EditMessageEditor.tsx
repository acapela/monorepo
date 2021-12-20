import { Editor } from "@tiptap/react";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { MessageContentEditor } from "~frontend/message/composer/MessageContentComposer";
import { MessageTools } from "~frontend/message/composer/Tools";
import { useMessageEditorManager } from "~frontend/message/composer/useMessageEditorManager";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

import { updateMessageAndMeta } from "../createNewMessage";

interface Props {
  message: MessageEntity;
  onCancelRequest?: () => void;
  onSaved?: () => void;
}

export const EditMessageEditor = observer(({ message, onCancelRequest, onSaved }: Props) => {
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
    updateMessageAndMeta(message, {
      attachments: attachmentsDrafts,
      // TODO!
      decisionOptions: [],
      newContent: content,
    });

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
