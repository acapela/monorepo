import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Attachment, Message_Type_Enum, useCreateMessageMutation } from "~frontend/gql";
import { EmojiPicker } from "~ui/EmojiPicker";
import { Field, useFieldValue } from "~ui/field";
import { FileUpload } from "~frontend/views/thread/FileUpload";

function chooseMessageType(mime: string) {
  return Message_Type_Enum.Text;
}

export const MessageComposer: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [createMessage] = useCreateMessageMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const textField = useFieldValue("", inputRef);
  const [attachments, setAttachments] = useState<{ [key: string]: Attachment }>({});

  const onAttachmentAdded = (attachment: Attachment) => setAttachments({ ...attachments, [attachment.id]: attachment });

  return (
    <>
      <UIForm
        onSubmit={async (event) => {
          event.preventDefault();

          if (!textField.value) {
            // TODO: Add proper validation UI
            alert("Message content is required");
          }

          await createMessage({
            variables: {
              threadId: threadId,
              type: Message_Type_Enum.Text,
              text: textField.value,
              attachments: Object.keys(attachments).map((attachmentId) => ({
                attachment_id: attachmentId,
              })),
            },
          });

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
