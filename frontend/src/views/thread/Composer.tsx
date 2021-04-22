import React, { useRef, useState } from "react";
import styled from "styled-components";

import { Message_Type_Enum, useCreateMessageMutation } from "~frontend/gql";
import { EmojiPicker } from "~ui/EmojiPicker";
import { Field, useFieldValue } from "~ui/field";
import { FileUpload } from "~frontend/views/thread/FileUpload";
import { chooseType } from "~frontend/utils/chooseMessageType";

const Attachments = ({
  shouldTranscribe,
  onAttachmentAdded,
}: {
  shouldTranscribe: boolean;
  onAttachmentAdded: ({ uuid, mimeType }: { uuid: string; mimeType: string }) => void;
}) => {
  if (shouldTranscribe) {
    return <FileUpload onFileAttached={onAttachmentAdded} />;
  }

  return (
    <>
      <FileUpload onFileAttached={onAttachmentAdded} />
      <br />
      <FileUpload onFileAttached={onAttachmentAdded} />
      <br />
      <FileUpload onFileAttached={onAttachmentAdded} />
    </>
  );
};

export const MessageComposer: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [createMessage] = useCreateMessageMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const textField = useFieldValue("", inputRef);
  const [attachments, setAttachments] = useState<{ [key: string]: string }>({});
  const [shouldTranscribe, setShouldTranscribe] = useState<boolean>(false);

  const onAttachmentAdded = ({ uuid, mimeType }: { uuid: string; mimeType: string }) =>
    setAttachments({ ...attachments, [uuid]: mimeType });

  return (
    <>
      <UIForm
        onSubmit={async (event) => {
          event.preventDefault();

          if (!textField.value) {
            // TODO: Add proper validation UI
            // Should still be possible to send a file without text content
            alert("Message content is required");
          }

          const attachmentsIds = Object.keys(attachments);

          await createMessage({
            variables: {
              threadId: threadId,
              type: shouldTranscribe ? chooseType(attachments[Object.keys(attachments)[0]]) : Message_Type_Enum.Text,
              text: textField.value,
              attachments: attachmentsIds.map((attachmentId) => ({
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
        <label>
          Transcribe
          <input
            type="checkbox"
            defaultChecked={shouldTranscribe}
            onChange={(event) => setShouldTranscribe(event.target.checked)}
          />
        </label>
        <br />
        <Attachments onAttachmentAdded={onAttachmentAdded} shouldTranscribe={shouldTranscribe} />
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
