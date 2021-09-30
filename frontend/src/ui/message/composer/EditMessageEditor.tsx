import { observer } from "mobx-react";
import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { clientdb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { bindAttachmentsToMessage, removeAttachment } from "~frontend/gql/attachments";
import { withFragments } from "~frontend/gql/utils";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import {
  EditMessageEditor_MessageFragment,
  UpdateMessageContentMutation,
  UpdateMessageContentMutationVariables,
} from "~gql";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichEditorNode } from "~richEditor/content/types";
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
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>(
    message.attachments.all.map((messageAttachment) => {
      return {
        mimeType: messageAttachment.mime_type,
        uuid: messageAttachment.id,
      };
    })
  );
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

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

    const updatingMessagePromise = updateMessageContent({
      variables: {
        id: message.id,
        content,
      },
    }) as Promise<unknown>;

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
        hideEditorSubmitButton
      />
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
