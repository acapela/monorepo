import React, { useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { useCreateMessageMutation } from "~frontend/gql/messages";
import { bindAttachmentsToMessage } from "~frontend/gql/attachments";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { getEmptyRichContent } from "~richEditor/RichEditor";
import { EditorAttachmentInfo } from "./attachments";
import { MessageContentEditor } from "./MessageContentComposer";
import { Recorder } from "./Recorder";
import { uploadFiles } from "./attachments";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { ReplyingToMessage } from "~frontend/ui/message/reply/ReplyingToMessage";
import { Message_Type_Enum } from "~gql";
import { RichEditorContent } from "~richEditor/content/types";

interface Props {
  topicId: string;
}

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: RichEditorContent;
  attachments: EditorAttachmentInfo[];
}

export const CreateNewMessageEditor = ({ topicId }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const [value, setValue] = useState<RichEditorContent>(getEmptyRichContent);
  const [createMessage, { loading: isCreatingMessage }] = useCreateMessageMutation();

  const topicContext = useTopicStoreContext();

  const isEditingAnyMessage = topicContext.useSelector((store) => !!store.editedMessageId);

  const { currentlyReplyingToMessage } = topicContext.useValue();
  const handleStopReplyingToMessage = () => {
    topicContext.update((draft) => (draft.currentlyReplyingToMessage = null));
  };

  async function handleNewFiles(files: File[]) {
    const uploadedAttachments = await uploadFiles(files);

    attachmentsList.push(...uploadedAttachments);
  }

  const submitMessage = async ({ type, content, attachments }: SubmitMessageParams) => {
    const [message] = await createMessage({
      topicId,
      type,
      content,
      replied_to_message_id: currentlyReplyingToMessage?.id,
    });

    if (message) {
      await Promise.all(
        bindAttachmentsToMessage(
          message.id,
          attachments.map(({ uuid }) => uuid)
        )
      );
    }

    handleStopReplyingToMessage();
  };

  return (
    <UIEditorContainer>
      <Recorder
        onRecordingReady={async (recording) => {
          const uploadedAttachments = await uploadFiles([recording]);

          const messageType = chooseMessageTypeFromMimeType(uploadedAttachments[0].mimeType);

          await submitMessage({
            type: messageType,
            content: getEmptyRichContent(),
            attachments: uploadedAttachments,
          });
        }}
      />
      <MessageContentEditor
        disableFileDrop={isEditingAnyMessage}
        content={value}
        onContentChange={setValue}
        onSubmit={async () => {
          if (isCreatingMessage) return;

          attachmentsList.clear();
          setValue(getEmptyRichContent());

          try {
            await submitMessage({
              type: "TEXT",
              content: value,
              attachments,
            });
          } catch (error) {
            // In case of error - restore attachments and content you were trying to send
            attachmentsList.set(attachments);
            setValue(value);
          }
        }}
        onFilesSelected={handleNewFiles}
        autofocusKey={topicId}
        attachments={attachments}
        onAttachmentRemoveRequest={(attachmentId) => {
          attachmentsList.filter((existingAttachment) => {
            return existingAttachment.uuid !== attachmentId;
          });
        }}
        additionalContent={
          currentlyReplyingToMessage && (
            <ReplyingToMessage onRemove={handleStopReplyingToMessage} message={currentlyReplyingToMessage} />
          )
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
