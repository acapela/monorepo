import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { createMessage } from "~frontend/gql/messages";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { EditorContent } from "~richEditor/RichEditor";
import { EditorAttachmentInfo } from "./attachments";
import { MessageContentEditor } from "./MessageContentComposer";
import { Recorder } from "./Recorder";
import { uploadFiles } from "./attachments";
import { useTopicStore } from "~frontend/topics/TopicStore";
import { ReplyingToMessage } from "~frontend/ui/message/ReplyingToMessage";
import { Message_Type_Enum } from "~gql";

interface Props {
  topicId: string;
}

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: EditorContent;
  attachments: EditorAttachmentInfo[];
}

export const CreateNewMessageEditor = ({ topicId }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const [value, setValue] = useState<EditorContent>([]);

  const [{ currentlyReplyingToMessageId }, updateTopicState] = useTopicStore();
  const handlStopReplyingToMessage = () => {
    updateTopicState((draft) => (draft.currentlyReplyingToMessageId = null));
  };

  async function handleNewFiles(files: File[]) {
    const uploadedAttachments = await uploadFiles(files);

    attachmentsList.push(...uploadedAttachments);
  }

  const submitMessage = async ({ type, content, attachments }: SubmitMessageParams) => {
    await createMessage({
      topicId,
      type,
      content,
      attachments: attachments.map((attachment) => ({
        attachment_id: attachment.uuid,
      })),
      replied_to_message_id: currentlyReplyingToMessageId,
    });

    handlStopReplyingToMessage();
  };

  return (
    <UIEditorContainer>
      <Recorder
        onRecordingReady={async (recording) => {
          const uploadedAttachments = await uploadFiles([recording]);

          const messageType = chooseMessageTypeFromMimeType(uploadedAttachments[0].mimeType);

          await submitMessage({
            type: messageType,
            content: [],
            attachments: uploadedAttachments,
          });
        }}
      />
      <MessageContentEditor
        content={value}
        onContentChange={setValue}
        onSubmit={async () => {
          await submitMessage({
            type: "TEXT",
            content: value,
            attachments,
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
        replyingToMessage={
          currentlyReplyingToMessageId ? (
            <ReplyingToMessage onRemove={handlStopReplyingToMessage} id={currentlyReplyingToMessageId} />
          ) : null
        }
      />
    </UIEditorContainer>
  );
};

const UIEditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
