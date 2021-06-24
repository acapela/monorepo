import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { MessageDetailedInfoFragment } from "~gql";
import { EditorContent } from "~richEditor/RichEditor";
import { Button } from "~ui/buttons/Button";
import { TransparentButton } from "~ui/buttons/TransparentButton";
import { HStack } from "~ui/Stack";
import { addMessageAttachment, removeMessageAttachment } from "~frontend/gql/attachments";
import { updateTextMessage } from "~frontend/gql/messages";
import { EditorAttachmentInfo, uploadFiles } from "./attachments";
import { MessageContentEditor } from "./MessageContentComposer";
import { makePromiseVoidable } from "~shared/promises";
import { useShortcut } from "~ui/keyboard/useShortcut";

interface Props {
  message: MessageDetailedInfoFragment;
  onCancelRequest?: () => void;
  onSaved?: () => void;
}

export const EditMessageEditor = ({ message, onCancelRequest, onSaved }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>(
    message.message_attachments.map((messageAttachment) => {
      return {
        mimeType: messageAttachment.attachment.mimeType,
        uuid: messageAttachment.attachment.id,
      };
    })
  );

  const [content, setContent] = useState<EditorContent>(message.content);

  useShortcut("Escape", onCancelRequest);

  async function handleSubmit() {
    const attachmentsToAdd = attachments.filter((attachmentNow) => {
      return !message.message_attachments.some(
        (messageAttachment) => messageAttachment.attachment.id === attachmentNow.uuid
      );
    });

    const existingAttachmentsToRemove = message.message_attachments.filter((existingMessageAttachment) => {
      return !attachments.some((attachmentNow) => attachmentNow.uuid === existingMessageAttachment.attachment.id);
    });

    const addingAttachmentsPromises = attachmentsToAdd.map(async (addedAttachment) => {
      await addMessageAttachment({ messageId: message.id, attachmentId: addedAttachment.uuid });
    });

    const removingAttachmentsPromises = existingAttachmentsToRemove.map(async (attachmentToRemove) => {
      await removeMessageAttachment({ messageId: message.id, attachmentId: attachmentToRemove.attachment.id });
    });

    // TS below want Promise.all all promises to return the same type if we use ... on array. Let's use void as we don't care about the result.
    const updatingMessagePromise = makePromiseVoidable(
      updateTextMessage({
        id: message.id,
        isDraft: false,
        content: content,
      })
    );

    await Promise.all([...addingAttachmentsPromises, ...removingAttachmentsPromises, updatingMessagePromise]);

    onSaved?.();
  }

  return (
    <UIHolder>
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
        hideEditorSubmitButton
      />
      <UIButtons gap={8} justifyContent="end">
        <TransparentButton onClick={onCancelRequest}>Cancel</TransparentButton>
        <Button onClick={handleSubmit}>Save</Button>
      </UIButtons>
    </UIHolder>
  );
};

const UIHolder = styled.div``;

const UIButtons = styled(HStack)`
  margin-top: 8px;
`;
