import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { clientdb } from "~frontend/clientdb";
import { bindAttachmentsToMessage } from "~frontend/gql/attachments";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { EditorAttachmentInfo, uploadFiles } from "~frontend/ui/message/composer/attachments";
import { MessageComposerContext } from "~frontend/ui/message/composer/MessageComposerContext";
import { MessageContentEditor } from "~frontend/ui/message/composer/MessageContentComposer";
import { Recorder } from "~frontend/ui/message/composer/Recorder";
import { ReplyingToMessageById } from "~frontend/ui/message/reply/ReplyingToMessage";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { Message_Type_Enum } from "~gql";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { select, useAutorun } from "~shared/sharedState";
import { getUUID } from "~shared/uuid";

interface Props {
  topicId: string;
  isDisabled: boolean;
  onMessageSent: () => void;
}

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: RichEditorNode;
  attachments: EditorAttachmentInfo[];
}

export const CreateNewMessageEditor = observer(({ topicId, isDisabled, onMessageSent }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const [value, setValue] = useState<RichEditorNode>(getEmptyRichContent);
  // const [createMessage] = useCreateMessageMutation();

  const editorRef = useRef<Editor>(null);

  const topicContext = useTopicStoreContext();
  const roomContext = useRoomStoreContext();

  const isEditingAnyMessage = select(() => !!topicContext.editedMessageId);
  const replyingToMessageId = select(() => topicContext.currentlyReplyingToMessageId);
  const user = useAssertCurrentUser();

  function focusEditor() {
    // Don't focus editor if editing some topic name
    if (roomContext.editingNameTopicId) {
      return;
    }

    editorRef.current?.chain().focus("end").run();
  }

  useAutorun(() => {
    if (!roomContext.editingNameTopicId) {
      focusEditor();
    }
  });

  useDependencyChangeEffect(() => {
    if (!isEditingAnyMessage) focusEditor();
  }, [isEditingAnyMessage]);

  useDependencyChangeEffect(focusEditor, [replyingToMessageId]);

  const handleStopReplyingToMessage = () => {
    topicContext.currentlyReplyingToMessageId = null;
  };

  async function handleNewFiles(files: File[]) {
    const uploadedAttachments = await uploadFiles(files);

    attachmentsList.push(...uploadedAttachments);
  }

  const submitMessage = async ({ type, content, attachments }: SubmitMessageParams) => {
    const messageId = getUUID();
    const newMessage = clientdb.message.create({
      __typename: "message",
      content,
      type,
      id: messageId,
      created_at: new Date().toISOString(),
      topic_id: topicId,
      user_id: user.id,
      replied_to_message_id: topicContext.currentlyReplyingToMessageId,
      updated_at: new Date().toISOString(),
    });

    if (newMessage) {
      trackEvent("Sent Message", {
        messageType: type,
        isReply: !!topicContext.currentlyReplyingToMessageId,
        hasAttachments: attachments.length > 0,
      });
      await Promise.all(
        bindAttachmentsToMessage(
          messageId,
          attachments.map(({ uuid }) => uuid)
        )
      );
    }

    handleStopReplyingToMessage();

    onMessageSent();
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
      <MessageComposerContext.Provider value={{ mode: "creating" }}>
        <MessageContentEditor
          ref={editorRef}
          isDisabled={isDisabled || isEditingAnyMessage}
          content={value}
          onContentChange={setValue}
          onSubmit={async () => {
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
          attachments={attachments}
          onEditorReady={focusEditor}
          onAttachmentRemoveRequest={(attachmentId) => {
            attachmentsList.filter((existingAttachment) => {
              return existingAttachment.uuid !== attachmentId;
            });
          }}
          additionalContent={
            topicContext.currentlyReplyingToMessageId && (
              <ReplyingToMessageById
                onRemove={handleStopReplyingToMessage}
                messageId={topicContext.currentlyReplyingToMessageId}
              />
            )
          }
        />
      </MessageComposerContext.Provider>
    </UIEditorContainer>
  );
});

const UIEditorContainer = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
