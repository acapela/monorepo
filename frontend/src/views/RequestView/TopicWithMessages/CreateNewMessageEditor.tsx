import { observer } from "mobx-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { bindAttachmentsToMessage } from "~frontend/gql/attachments";
import { MentionTaskDraftsContext, useStoredContentAndTasks } from "~frontend/message/content-and-task-drafts";
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
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { select } from "~shared/sharedState";
import { getUUID } from "~shared/uuid";
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
  const db = useDb();

  const editorRef = useRef<Editor>(null);

  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

  const { content, taskDrafts, mentionTasksContextValue, setContentAndUpdateTasks } = useStoredContentAndTasks(topicId);

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

  const handleStopReplyingToMessage = () => {
    topicContext && (topicContext.currentlyReplyingToMessageId = null);
  };

  const submitMessage = async ({ type, content, attachments }: SubmitMessageParams) => {
    const messageId = getUUID();

    const newMessage = db.message.create({
      id: messageId,
      topic_id: topicId,
      type,
      content,
      replied_to_message_id: topicContext?.currentlyReplyingToMessageId,
    });
    for (const taskDraft of taskDrafts) {
      db.task.create({
        id: taskDraft.id,
        message_id: messageId,
        user_id: taskDraft.userId,
        type: taskDraft.type,
      });
    }

    setContentAndUpdateTasks(getEmptyRichContent());

    trackEvent("Sent Message", {
      messageType: type,
      isReply: !!topicContext?.currentlyReplyingToMessageId,
      hasAttachments: attachments.length > 0,
    });
    await Promise.all(
      bindAttachmentsToMessage(
        messageId,
        attachments.map(({ uuid }) => uuid)
      )
    );

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
      <MentionTaskDraftsContext.Provider value={mentionTasksContextValue}>
        <MessageContentEditor
          ref={editorRef}
          isDisabled={isDisabled || isEditingAnyMessage}
          content={content}
          onContentChange={setContentAndUpdateTasks}
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
              setContentAndUpdateTasks(content);
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
      </MentionTaskDraftsContext.Provider>
    </UIEditorContainer>
  );
});

const UIValidationError = styled.div`
  color: ${theme.colors.layout.supportingText()};
  ${theme.font.body14.build()};
`;

const UIEditorContainer = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;
