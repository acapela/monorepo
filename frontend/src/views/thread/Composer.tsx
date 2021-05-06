import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { Message_Type_Enum } from "~frontend/gql";
import { useCreateMessageMutation } from "~frontend/gql/threads";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { EditorContent, RichEditor } from "~richEditor/RichEditor";
import { AttachmentPreview } from "./AttachmentPreview";
import { Recorder } from "./Recorder";
import { AudioRecorder } from "./Recorder/AudioRecorder";
import { VideoRecorder } from "./Recorder/VideoRecorder";
import { uploadFile } from "./uploadFile";

interface ComposerAttachment {
  uuid: string;
  mimeType: string;
}

export const MessageComposer: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [createMessage] = useCreateMessageMutation();

  const [attachments, attachmentsList] = useList<ComposerAttachment>([]);
  // const [shouldTranscribe, setShouldTranscribe] = useState<boolean>(false);
  const [value, setValue] = useState<EditorContent>([]);

  async function uploadFiles(files: File[]): Promise<ComposerAttachment[]> {
    const uploadedAttachments = await Promise.all(
      files.map(
        async (file): Promise<ComposerAttachment> => {
          const uuid = await uploadFile(file);

          return {
            uuid,
            mimeType: file.type,
          };
        }
      )
    );

    return uploadedAttachments;
  }

  async function handleNewFiles(files: File[]) {
    const uploadedAttachments = await uploadFiles(files);

    attachmentsList.push(...uploadedAttachments);
  }

  return (
    <>
      <UIEditorContainer>
        <Recorder
          onRecordingReady={async (recording: File) => {
            const uploadedAttachments = await uploadFiles([recording]);

            const messageType = chooseMessageTypeFromMimeType(uploadedAttachments[0].mimeType);

            await createMessage({
              threadId: threadId,
              type: messageType,
              content: "",
              attachments: uploadedAttachments.map((attachment) => ({
                attachment_id: attachment.uuid,
              })),
            });
          }}
        />
        <RichEditor
          value={value}
          onChange={setValue}
          onFilesSelected={handleNewFiles}
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
      </UIEditorContainer>

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

      {/* TODO: Integrate with rich editor */}
      {/* <div>
        <label>
          Is recording?
          <input
            type="checkbox"
            defaultChecked={shouldTranscribe}
            onChange={(event) => setShouldTranscribe(event.target.checked)}
          />
        </label>
      </div> */}
    </>
  );
};

const UIEditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${AudioRecorder}, ${VideoRecorder} {
    margin-right: 1rem;
  }

  div:nth-child(2) {
    flex-grow: 1;
  }
`;

const UIAttachmentsPreviews = styled.div``;
