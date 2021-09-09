import { observer } from "mobx-react";
import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { clientdb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { bindAttachmentsToMessage, removeAttachment } from "~frontend/gql/attachments";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichEditorNode } from "~richEditor/content/types";
import { Button } from "~ui/buttons/Button";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { HStack } from "~ui/Stack";

import { EditorAttachmentInfo, uploadFiles } from "./attachments";
import { MessageComposerContext } from "./MessageComposerContext";
import { MessageContentEditor } from "./MessageContentComposer";

interface Props {
  message: MessageEntity;
  onCancelRequest?: () => void;
  onSaved?: () => void;
}

export const EditMessageEditor = observer(({ message, onCancelRequest, onSaved }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>(
    message.attachments.all.map((messageAttachment) => {
      return {
        mimeType: messageAttachment.mime_type,
        uuid: messageAttachment.id,
      };
    })
  );

  const [content, setContent] = useState<RichEditorNode>(message.content);

  useShortcut("Escape", onCancelRequest);
  useShortcut("Enter", () => {
    handleSubmit();

    // Don't pass enter to editor as it would insert new line
    return true;
  });

  async function handleSubmit() {
    const attachmentsToAdd = attachments.filter((attachmentNow) => {
      return !message.attachments.all.some((messageAttachment) => messageAttachment.id === attachmentNow.uuid);
    });

    const existingAttachmentsToRemove = message.attachments.all.filter((existingMessageAttachment) => {
      return !attachments.some((attachmentNow) => attachmentNow.uuid === existingMessageAttachment.id);
    });

    const addAttachmentsPromises = bindAttachmentsToMessage(
      message.id,
      attachmentsToAdd.map(({ uuid }) => uuid)
    );

    const removingAttachmentsPromises = existingAttachmentsToRemove.map(async (attachmentToRemove) => {
      await removeAttachment({ id: attachmentToRemove.id });
    });

    message.update({ content });

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
      <MessageComposerContext.Provider value={{ mode: "editing" }}>
        <MessageContentEditor
          content={content}
          onContentChange={setContent}
          onFilesSelected={async (files) => {
            const newAttachments = await uploadFiles(files);

            attachmentsList.push(...newAttachments);
          }}
          attachments={attachments}
          onAttachmentRemoveRequest={(attachmentId) => {
            attachmentsList.filter((existingAttachment) => {
              return existingAttachment.uuid !== attachmentId;
            });
          }}
          autofocusKey={message.id}
          hideEditorSubmitButton
        />
      </MessageComposerContext.Provider>
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
