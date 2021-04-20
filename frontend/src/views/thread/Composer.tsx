import React, { useRef, useState } from "react";
import styled from "styled-components";
import { AttachmentDetailedInfoFragment, Message_Type_Enum, useCreateMessageMutation } from "~frontend/gql";
import { EmojiPicker } from "~ui/EmojiPicker";
import { Field, useFieldValue } from "~ui/field";
import { FileUpload } from "~frontend/views/thread/FileUpload";

function chooseType(mimeType: string): Message_Type_Enum {
  const category = mimeType.split("/")[0].toLowerCase();

  switch (category) {
    case "audio":
      return Message_Type_Enum.Audio;
    case "video":
      return Message_Type_Enum.Video;
    default:
      // Message_Type_Enum.File is not used
      return Message_Type_Enum.Text;
  }
}

const Attachments = ({
  shouldTranscribe,
  onAttachmentAdded,
}: {
  shouldTranscribe: boolean;
  onAttachmentAdded: (attachment: AttachmentDetailedInfoFragment) => void;
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
  const [attachments, setAttachments] = useState<{ [key: string]: AttachmentDetailedInfoFragment }>({});
  const [shouldTranscribe, setShouldTranscribe] = useState<boolean>(false);

  const onAttachmentAdded = (attachment: AttachmentDetailedInfoFragment) =>
    setAttachments({ ...attachments, [attachment.id]: attachment });

  return (
    <>
      <UIForm
        onSubmit={async (event) => {
          event.preventDefault();

          if (!textField.value) {
            // TODO: Add proper validation UI
            alert("Message content is required");
          }

          const attachmentsIds = Object.keys(attachments);

          await createMessage({
            variables: {
              threadId: threadId,
              type: shouldTranscribe
                ? chooseType(attachments[Object.keys(attachments)[0]].mimeType)
                : Message_Type_Enum.Text,
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
