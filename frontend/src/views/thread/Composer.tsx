import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { Message_Type_Enum } from "~frontend/gql";
import { useCreateMessageMutation } from "~frontend/gql/threads";
import { EditorContent, RichEditor } from "~richEditor/RichEditor";
import { AttachmentPreview } from "./AttachmentPreview";
import { uploadFile } from "./uploadFile";

interface ComposerAttachment {
  uuid: string;
  mimeType: string;
}

export const MessageComposer: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [createMessage] = useCreateMessageMutation();

  const [attachments, attachmentsList] = useList<ComposerAttachment>([]);
  const [shouldTranscribe, setShouldTranscribe] = useState<boolean>(false);
  const [value, setValue] = useState<EditorContent>([]);

  async function handleNewFile(file: File) {
    const uuid = await uploadFile(file);
    attachmentsList.push({ mimeType: file.type, uuid });
  }

  return (
    <>
      <RichEditor
        value={value}
        onChange={setValue}
        onFileSelected={handleNewFile}
        onSubmit={async () => {
          await createMessage({
            threadId: threadId,
            type: Message_Type_Enum.Text,
            content: value,
            attachments: attachments.map((attachment) => ({
              attachment_id: attachment.uuid,
            })),
          });

          attachmentsList.clear();
          setValue([]);
        }}
      />

      {attachments.length > 0 && (
        <UIAttachmentsPreviews>
          {attachments.map((attachment, index) => {
            return (
              <AttachmentPreview
                id={attachment.uuid}
                key={attachment.uuid}
                onRemoveRequest={() => attachmentsList.removeAt(index)}
              />
            );
          })}
        </UIAttachmentsPreviews>
      )}

      {/* TODO: Restore emoji picker inside rich editor */}
      {/* <EmojiPicker
          onPicked={(emoji) => {
            textField.appendAtCursor(emoji);
          }}
        /> */}

      <div>
        <label>
          Is recording?
          <input
            type="checkbox"
            defaultChecked={shouldTranscribe}
            onChange={(event) => setShouldTranscribe(event.target.checked)}
          />
        </label>
      </div>
    </>
  );
};

const UIAttachmentsPreviews = styled.div``;
