import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { useCreateMessageMutation } from "~frontend/gql/topics";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { EditorContent, RichEditor } from "~richEditor/RichEditor";
import { AttachmentPreview } from "./AttachmentPreview";
import { ATTACHMENT_PREVIEW_HEIGHT_PX } from "./Message/MessageAttachmentDisplayer";
import { Recorder } from "./Recorder";
import { uploadFile } from "./uploadFile";

interface ComposerAttachment {
  uuid: string;
  mimeType: string;
}

interface Props {
  topicId: string;
}

export const MessageComposer = ({ topicId }: Props) => {
  const [createMessage] = useCreateMessageMutation();

  const [attachments, attachmentsList] = useList<ComposerAttachment>([]);
  const [value, setValue] = useState<EditorContent>([]);

  async function uploadFiles(files: File[]): Promise<ComposerAttachment[]> {
    const uploadedAttachments = await Promise.all(
      files.map(async (file): Promise<ComposerAttachment> => {
        const uuid = await uploadFile(file);

        return {
          uuid,
          mimeType: file.type,
        };
      })
    );

    return uploadedAttachments;
  }

  async function handleNewFiles(files: File[]) {
    const uploadedAttachments = await uploadFiles(files);

    attachmentsList.push(...uploadedAttachments);
  }

  return (
    <>
      kljjlk
      <UIEditorContainer>
        <Recorder
          onRecordingReady={async (recording) => {
            const uploadedAttachments = await uploadFiles([recording]);

            const messageType = chooseMessageTypeFromMimeType(uploadedAttachments[0].mimeType);

            await createMessage({
              topicId: topicId,
              type: messageType,
              content: [],
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
              topicId: topicId,
              type: "TEXT",
              content: value,
              attachments: attachments.map((attachment) => ({
                attachment_id: attachment.uuid,
              })),
            });

            attachmentsList.clear();
            setValue([]);
          }}
          placeholder="Type here to start contributing..."
          autoFocusKey={topicId}
          additionalContent={
            attachments.length > 0 && (
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
            )
          }
        />
      </UIEditorContainer>
    </>
  );
};

const UIEditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UIAttachmentsPreviews = styled.div`
  height: ${ATTACHMENT_PREVIEW_HEIGHT_PX}px;
  display: flex;
`;
