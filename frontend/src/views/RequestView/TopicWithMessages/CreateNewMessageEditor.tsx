import { useApolloClient } from "@apollo/client";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { useLocalStorageState } from "~frontend/hooks/useLocalStorageState";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { EditorAttachmentInfo, uploadFiles } from "~frontend/ui/message/composer/attachments";
import { MessageContentEditor } from "~frontend/ui/message/composer/MessageContentComposer";
import { Recorder } from "~frontend/ui/message/composer/Recorder";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import { ReplyingToMessageById } from "~frontend/ui/message/reply/ReplyingToMessage";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { Message_Type_Enum } from "~gql";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { getUniqueMentionDataFromContent } from "~shared/editor/mentions";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { select } from "~shared/sharedState";
import { theme } from "~ui/theme";

interface Props {
  topicId: string;
  isDisabled?: boolean;
  requireMention: boolean;
  onMessageSent: () => void;
}

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: RichEditorNode;
  attachments: EditorAttachmentInfo[];
}

export const CreateNewMessageEditor = observer(({ topicId, isDisabled, onMessageSent, requireMention }: Props) => {
  const apolloClient = useApolloClient();
  const db = useDb();

  const editorRef = useRef<Editor>(null);

  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

  const [content, setContent] = useLocalStorageState<RichEditorNode>({
    key: "message-draft-for-topic:" + topicId,
    initialValue: getEmptyRichContent(),
  });

  const topicContext = useTopicStoreContext();

  const isEditingAnyMessage = select(() => !!topicContext?.editedMessageId);
  const replyingToMessageId = select(() => topicContext?.currentlyReplyingToMessageId ?? null);

  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false);
  const validator = useCallback(
    (value: RichEditorNode) => {
      if (requireMention) {
        const mentionNodes = getNodesFromContentByType(value, "mention");
        if (mentionNodes.length < 1) {
          return "The first message should have a mention.";
        }
      }

      return null;
    },
    [requireMention]
  );
  const validationErrorMessage = useMemo(() => {
    if (!shouldValidateOnChange) return null;

    return validator(content);
  }, [shouldValidateOnChange, validator, content]);

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

  const submitMessage = action(async ({ type, content, attachments }: SubmitMessageParams) => {
    const newMessage = db.message.create({
      topic_id: topicId,
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

    onMessageSent();
  });

  return (
    <UIEditorContainer>
      <Recorder
        onRecordingReady={async (recording) => {
          const uploadedAttachments = await uploadFiles(apolloClient, [recording]);

          const messageType = chooseMessageTypeFromMimeType(uploadedAttachments[0].mimeType);

          await submitMessage({
            type: messageType,
            content: getEmptyRichContent(),
            attachments: uploadedAttachments,
          });
        }}
      />
      <MessageContentEditor
        ref={editorRef}
        isDisabled={isDisabled || isEditingAnyMessage}
        content={content}
        onContentChange={setContent}
        onSubmit={async () => {
          if (validator(content)) {
            setShouldValidateOnChange(true);
            return;
          }

          attachmentsList.clear();

          try {
            await submitMessage({
              type: "TEXT",
              content: content,
              attachments,
            });
          } catch (error) {
            console.error("error while submitting message", error);
            // In case of error - restore attachments and content you were trying to send
            attachmentsList.set(attachments);
            setContent(content);
          }
        }}
        onFilesSelected={uploadAttachments}
        uploadingAttachments={uploadingAttachments}
        attachments={attachments}
        onEditorReady={focusEditor}
        onAttachmentRemoveRequest={(attachmentId) => {
          attachmentsList.filter((existingAttachment) => {
            return existingAttachment.uuid !== attachmentId;
          });
        }}
        additionalContent={
          <>
            {validationErrorMessage && <UIValidationError>{validationErrorMessage}</UIValidationError>}
            {topicContext?.currentlyReplyingToMessageId && (
              <ReplyingToMessageById
                onRemove={handleStopReplyingToMessage}
                messageId={topicContext.currentlyReplyingToMessageId}
              />
            )}
          </>
        }
      />
    </UIEditorContainer>
  );
});

const UIValidationError = styled.div`
  ${theme.typo.content.secondary};
`;

const UIEditorContainer = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;
