import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { createMessage } from "~frontend/gql/messages";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { EditorContent } from "~richEditor/RichEditor";
import { EditorAttachmentInfo } from "./attachments";
import { MessageContentEditor } from "./MessageContentComposer";
import { Recorder } from "./Recorder";
import { uploadFile } from "./uploadFile";

interface Props {
  topicId: string;
}

export const NewMessageBar = ({ topicId }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const [value, setValue] = useState<EditorContent>([]);

  async function uploadFiles(files: File[]): Promise<EditorAttachmentInfo[]> {
    const uploadedAttachments = await Promise.all(
      files.map(async (file): Promise<EditorAttachmentInfo> => {
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
      <MessageContentEditor
        content={value}
        onContentChange={setValue}
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
        onFilesSelected={handleNewFiles}
        autofocusKey={topicId}
        attachments={attachments}
        onAttachmentRemoveRequest={(attachmentId) => {
          attachmentsList.filter((existingAttachment) => {
            return existingAttachment.uuid !== attachmentId;
          });
        }}
      />
    </UIEditorContainer>
  );
};

const UIEditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
