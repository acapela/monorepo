import React, { useState } from "react";
import { Message_Type_Enum } from "~frontend/gql";
import { useCreateMessageMutation } from "~frontend/gql/threads";
import { chooseType } from "~frontend/utils/chooseMessageType";
import { FileUpload } from "~frontend/views/thread/FileUpload";
import { EditorContent, RichEditor } from "~richEditor/RichEditor";

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
  const [attachments, setAttachments] = useState<{ [key: string]: string }>({});
  const [shouldTranscribe, setShouldTranscribe] = useState<boolean>(false);
  const [value, setValue] = useState<EditorContent>([]);

  const onAttachmentAdded = ({ uuid, mimeType }: { uuid: string; mimeType: string }) =>
    setAttachments({ ...attachments, [uuid]: mimeType });

  return (
    <>
      <RichEditor value={value} onChange={setValue} />
      <button
        onClick={async () => {
          const attachmentsIds = Object.keys(attachments);

          await createMessage({
            threadId: threadId,
            type: shouldTranscribe ? chooseType(attachments[Object.keys(attachments)[0]]) : Message_Type_Enum.Text,
            content: value,
            attachments: attachmentsIds.map((attachmentId) => ({
              attachment_id: attachmentId,
            })),
          });

          setAttachments({});
          setValue([]);
        }}
      >
        Send
      </button>
      {/* TODO: Restore emoji picker inside rich editor */}
      {/* <EmojiPicker
          onPicked={(emoji) => {
            textField.appendAtCursor(emoji);
          }}
        /> */}

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
