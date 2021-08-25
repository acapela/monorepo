import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { bindAttachmentsToMessage, removeAttachment } from "~frontend/gql/attachments";
import { withFragments } from "~frontend/gql/utils";
import {
  EditMessageEditor_MessageFragment,
  UpdateMessageContentMutation,
  UpdateMessageContentMutationVariables,
} from "~gql";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichEditorNode } from "~richEditor/content/types";
import { makePromiseVoidable } from "~shared/promises";
import { Button } from "~ui/buttons/Button";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { HStack } from "~ui/Stack";

import { EditorAttachmentInfo, uploadFiles } from "./attachments";
import { MessageContentEditor } from "./MessageContentComposer";

const fragments = {
  message: gql`
    fragment EditMessageEditor_message on message {
      id
      content
      message_attachments {
        id
        mime_type
      }
    }
  `,
};

interface Props {
  message: EditMessageEditor_MessageFragment;
  onCancelRequest?: () => void;
  onSaved?: () => void;
}

export const EditMessageEditor = withFragments(fragments, ({ message, onCancelRequest, onSaved }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>(
    message.message_attachments.map((messageAttachment) => {
      return {
        mimeType: messageAttachment.mime_type,
        uuid: messageAttachment.id,
      };
    })
  );

  const [content, setContent] = useState<RichEditorNode>(message.content);

  const [updateMessageContent] = useMutation<UpdateMessageContentMutation, UpdateMessageContentMutationVariables>(
    gql`
      mutation UpdateMessageContent($id: uuid!, $content: jsonb!) {
        message: update_message_by_pk(pk_columns: { id: $id }, _set: { content: $content }) {
          id
          content
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({
        __typename: "mutation_root",
        message: {
          __typename: "message",
          ...vars,
        },
      }),
    }
  );

  useShortcut("Escape", onCancelRequest);
  useShortcut("Enter", () => {
    handleSubmit();

    // Don't pass enter to editor as it would insert new line
    return true;
  });

  async function handleSubmit() {
    const attachmentsToAdd = attachments.filter((attachmentNow) => {
      return !message.message_attachments.some((messageAttachment) => messageAttachment.id === attachmentNow.uuid);
    });

    const existingAttachmentsToRemove = message.message_attachments.filter((existingMessageAttachment) => {
      return !attachments.some((attachmentNow) => attachmentNow.uuid === existingMessageAttachment.id);
    });

    const addAttachmentsPromises = bindAttachmentsToMessage(
      message.id,
      attachmentsToAdd.map(({ uuid }) => uuid)
    );

    const removingAttachmentsPromises = existingAttachmentsToRemove.map(async (attachmentToRemove) => {
      await removeAttachment({ id: attachmentToRemove.id });
    });

    // TS below want Promise.all all promises to return the same type if we use ... on array. Let's use void as we don't care about the result.
    const updatingMessagePromise = makePromiseVoidable(
      updateMessageContent({
        variables: {
          id: message.id,
          content,
        },
      })
    );

    await Promise.all([...addAttachmentsPromises, ...removingAttachmentsPromises, updatingMessagePromise]);
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
