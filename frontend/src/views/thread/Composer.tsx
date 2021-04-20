import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Attachment,
  Message,
  useCreateMessageDraftMutation,
  useDeleteTextMessageMutation,
  useGetMessageDraftQuery,
  useLinkAttachmentMutation,
  useUpdateTextMessageMutation,
} from "~frontend/gql";
import { EmojiPicker } from "~ui/EmojiPicker";
import { Field, useFieldValue } from "~ui/field";
import { FileUpload } from "~frontend/views/thread/FileUpload";

function useGetDraft(threadId: string) {
  const { data } = useGetMessageDraftQuery({ variables: { threadId } });
  const [draftId, setDraftId] = useState<string | null>(null);

  return { draft: data?.message?.[0] || ({ id: draftId } as Message), setDraftId };
}

export const MessageComposer: React.FC<{ threadId: string }> = ({ threadId }) => {
  const { draft, setDraftId } = useGetDraft(threadId);
  const [createMessageDraft] = useCreateMessageDraftMutation();
  const [updateMessage] = useUpdateTextMessageMutation();
  const [deleteDraft] = useDeleteTextMessageMutation();
  const [linkAttachment] = useLinkAttachmentMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const textField = useFieldValue("", inputRef);
  const [attachments, setAttachments] = useState<{ [key: string]: Attachment }>({});

  const onAttachmentAdded = (attachment: Attachment) => setAttachments({ ...attachments, [attachment.id]: attachment });

  // Prefill draft
  useEffect(() => {
    if (draft?.text) {
      textField.setValue(draft.text);
    }
  }, [draft]);

  // Auto-save draft
  useEffect(() => {
    if (!draft.id && Object.keys(attachments).length) {
      console.log("DRAFT");
      createMessageDraft({
        variables: {
          threadId,
          text: textField.value,
        },
      }).then(({ data }) => setDraftId(data?.message?.id));
    }

    // TODO: needs to compare with prev value
    // if (draft.id && textField.value) {
    //   console.log('UPDATE DRAFT');
    //   updateMessage({
    //     variables: {
    //       id: draft.id,
    //       text: textField.value,
    //     },
    //   });
    // }

    // if (draft.id && !textField.value && !attachments.size) {
    //   console.log("DELETE DRAFT");
    //   setDraftId(null);
    //   deleteDraft({
    //     variables: {
    //       id: draft.id,
    //     },
    //   });
    // }
  }, [draft, attachments]);

  return (
    <>
      <UIForm
        onSubmit={async (event) => {
          event.preventDefault();

          if (!textField.value) {
            // TODO: Add proper validation UI
            alert("Message content is required");
          }

          await Promise.all(
            Object.keys(attachments)
              .map((attachmentId) =>
                linkAttachment({
                  variables: {
                    messageId: draft.id,
                    attachmentId,
                  },
                })
              )
              .concat(
                updateMessage({
                  variables: {
                    id: draft.id,
                    text: textField.value,
                    isDraft: false,
                    // attachments: Object.keys(attachments).map((attachmentID) => ({
                    //   attachment_id: attachmentID,
                    //   message_id: draft.id,
                    // }))
                  },
                })
              )
          );

          textField.reset();
          setAttachments({});
        }}
      >
        <EmojiPicker
          onPicked={(emoji) => {
            textField.appendAtCursor(emoji);
          }}
        />
        <Field ref={inputRef} placeholder="Write a message" {...textField.bindProps} />
      </UIForm>
      <div>
        <FileUpload onFileAttached={onAttachmentAdded} />
        <FileUpload onFileAttached={onAttachmentAdded} />
      </div>
    </>
  );
};

const UIForm = styled.form`
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  grid-gap: 20px;
`;
