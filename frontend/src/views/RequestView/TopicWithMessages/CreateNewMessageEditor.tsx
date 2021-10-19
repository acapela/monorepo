import { useApolloClient } from "@apollo/client";
import { isEqual } from "lodash";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useMemo, useRef } from "react";
import { useList } from "react-use";
import styled, { css } from "styled-components";

import { PopPresenceAnimator } from "~frontend/../../ui/animations";
import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { useLocalStorageState } from "~frontend/hooks/useLocalStorageState";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { EditorAttachmentInfo, uploadFiles } from "~frontend/ui/message/composer/attachments";
import { MessageContentEditor } from "~frontend/ui/message/composer/MessageContentComposer";
import { MessageTools } from "~frontend/ui/message/composer/Tools";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import { ReplyingToMessageById } from "~frontend/ui/message/reply/ReplyingToMessage";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { Message_Type_Enum } from "~gql";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { getUniqueMentionDataFromContent } from "~shared/editor/mentions";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { select } from "~shared/sharedState";
import { theme } from "~ui/theme";

import { NewMessageButtons } from "./NewMessageButtons";

interface Props {
  topic: TopicEntity;
  isDisabled?: boolean;
  onMessageSent: (params: SubmitMessageParams) => void;
  onClosePendingTasks: () => void;
}

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: RichEditorNode;
  attachments: EditorAttachmentInfo[];
}

export const CreateNewMessageEditor = observer(({ topic, isDisabled, onMessageSent, onClosePendingTasks }: Props) => {
  const apolloClient = useApolloClient();
  const db = useDb();

  const editorRef = useRef<Editor>(null);

  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

  const [content, setContent] = useLocalStorageState<RichEditorNode>({
    key: "message-draft-for-topic:" + topic.id,
    initialValue: getEmptyRichContent(),
  });

  const topicContext = useTopicStoreContext();

  const isEditingAnyMessage = select(() => !!topicContext?.editedMessageId);
  const replyingToMessageId = select(() => topicContext?.currentlyReplyingToMessageId ?? null);

  const hasTypedMessageContent = useMemo(() => !isEqual(content, getEmptyRichContent()), [content]);

  function focusEditor() {
    editorRef.current?.chain().focus("end").run();
  }

  useDependencyChangeEffect(() => {
    if (!isEditingAnyMessage) focusEditor();
  }, [isEditingAnyMessage]);

  useDependencyChangeEffect(focusEditor, [replyingToMessageId]);

  const handleStopReplyingToMessage = action(() => {
    topicContext && (topicContext.currentlyReplyingToMessageId = null);
  });

  const submitMessage = action((params: SubmitMessageParams) => {
    const { type, content, attachments } = params;
    const newMessage = db.message.create({
      topic_id: topic.id,
      type,
      content,
      replied_to_message_id: topicContext?.currentlyReplyingToMessageId,
    });

    for (const { userId, type } of getUniqueMentionDataFromContent(content)) {
      db.task.create({ message_id: newMessage.id, user_id: userId, type });
    }
    for (const attachment of attachments) {
      db.attachment.findById(attachment.uuid)?.update({ message_id: newMessage.id });
    }

    setContent(getEmptyRichContent());

    trackEvent("Sent Message", {
      messageType: type,
      isReply: !!topicContext?.currentlyReplyingToMessageId,
      hasAttachments: attachments.length > 0,
    });

    handleStopReplyingToMessage();

    onMessageSent(params);
  });

  const handleSubmitTextMessage = action(async (shouldClosePendingTasks: boolean) => {
    if (shouldClosePendingTasks) {
      onClosePendingTasks();
    }

    // Nothing to submit
    if (!hasTypedMessageContent && attachments.length === 0) {
      return;
    }

    try {
      await submitMessage({
        type: "TEXT",
        content: content,
        attachments,
      });

      attachmentsList.clear();
    } catch (error) {
      console.error("error while submitting message", error);
      // In case of error - restore attachments and content you were trying to send
      attachmentsList.set(attachments);
      setContent(content);
    }
  });

  return (
    <UIHolder>
      <>
        {topicContext?.currentlyReplyingToMessageId && (
          <ReplyingToMessageById
            onRemove={handleStopReplyingToMessage}
            messageId={topicContext.currentlyReplyingToMessageId}
          />
        )}
      </>
      <UIEditorContainer>
        <MessageContentEditor
          ref={editorRef}
          isDisabled={isDisabled || isEditingAnyMessage}
          content={content}
          onContentChange={setContent}
          onFilesSelected={uploadAttachments}
          uploadingAttachments={uploadingAttachments}
          attachments={attachments}
          onEditorReady={focusEditor}
          customEditFieldStyles={messageEditorSpacing}
          onAttachmentRemoveRequest={(attachmentId) => {
            attachmentsList.filter((existingAttachment) => {
              return existingAttachment.uuid !== attachmentId;
            });
          }}
        />
        <UIRequestControls>
          <MessageTools
            onRecordingReady={async (recording) => {
              console.log({ recording });
              const uploadedAttachments = await uploadFiles(apolloClient, [recording]);

              const messageType = chooseMessageTypeFromMimeType(uploadedAttachments[0].mimeType);

              await submitMessage({
                type: messageType,
                content: getEmptyRichContent(),
                attachments: uploadedAttachments,
              });
            }}
          />
          <NewMessageButtons
            topic={topic}
            onSendRequest={() => handleSubmitTextMessage(false)}
            onCompleteRequest={() => handleSubmitTextMessage(true)}
          />
        </UIRequestControls>
      </UIEditorContainer>
    </UIHolder>
  );
});

const messageEditorSpacing = css`
  padding: 15px 0;
`;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  ${theme.spacing.regular.asGap};
`;

const UIEditorContainer = styled.div<{}>`
  display: flex;
  flex-direction: row;
  /* Keeps the message controls pegged to the bottom when message is multiple lines */
  align-items: flex-end;
  width: 100%;

  ${theme.spacing.horizontalActionsSection.asGap}
`;
const UIRequestControls = styled(PopPresenceAnimator)<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.horizontalActionsSection.asGap}
`;
