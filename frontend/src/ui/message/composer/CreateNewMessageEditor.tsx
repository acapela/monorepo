import { Reference, gql, useMutation } from "@apollo/client";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { assertReadUserDataFromCookie } from "~frontend/authentication/cookie";
import { bindAttachmentsToMessage } from "~frontend/gql/attachments";
import { updateLastSeenMessage } from "~frontend/gql/topics";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { Message } from "~frontend/ui/message/messagesFeed/Message";
import { ReplyingToMessageById } from "~frontend/ui/message/reply/ReplyingToMessage";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { CreateNewMessageMutation, CreateNewMessageMutationVariables, Message_Type_Enum } from "~gql";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { select, useAutorun } from "~shared/sharedState";
import { getUUID } from "~shared/uuid";

import { EditorAttachmentInfo, uploadFiles } from "./attachments";
import { MessageContentEditor } from "./MessageContentComposer";
import { Recorder } from "./Recorder";

interface Props {
  topicId: string;
  isDisabled?: boolean;
}

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: RichEditorNode;
  attachments: EditorAttachmentInfo[];
}

const useCreateMessageMutation = () =>
  useMutation<CreateNewMessageMutation, CreateNewMessageMutationVariables>(
    gql`
      ${Message.fragments.message}

      mutation CreateNewMessage(
        $id: uuid!
        $topicId: uuid!
        $content: jsonb!
        $type: message_type_enum!
        $replied_to_message_id: uuid
      ) {
        message: insert_message_one(
          object: {
            id: $id
            content: $content
            topic_id: $topicId
            type: $type
            replied_to_message_id: $replied_to_message_id
          }
        ) {
          id
          topic_id
          ...Message_message
        }
      }
    `,
    {
      optimisticResponse: (vars) => {
        const userData = assertReadUserDataFromCookie();
        return {
          __typename: "mutation_root",
          message: {
            __typename: "message",
            id: vars.id,
            topic_id: vars.topicId,
            created_at: new Date().toISOString(),
            message_attachments: [],
            type: vars.type,
            message_reactions: [],
            transcription: null,
            user_id: userData.id,
            tasks: [],
            user: {
              __typename: "user",
              id: userData.id,
              avatar_url: userData.picture,
              email: userData.email,
              name: userData.name,
            },
            content: vars.content,
            replied_to_message_id: vars.replied_to_message_id,
          },
        };
      },
      update(cache, result) {
        const message = result.data?.message;
        if (!message) {
          return;
        }
        const newMessageRef = cache.writeFragment({
          data: message,
          fragment: Message.fragments.message,
          fragmentName: "Message_message",
        });
        if (!newMessageRef) {
          return;
        }
        cache.modify({
          id: cache.identify({ __typename: "topic", id: message.topic_id }),
          fields: {
            messages: (existing: Reference[]) =>
              existing.some((ref) => ref.__ref == newMessageRef.__ref) ? existing : existing.concat(newMessageRef),
          },
        });
      },
    }
  );

export const CreateNewMessageEditor = observer(({ topicId, isDisabled }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const [value, setValue] = useState<RichEditorNode>(getEmptyRichContent);
  const [createMessage, { loading: isCreatingMessage }] = useCreateMessageMutation();

  const editorRef = useRef<Editor>(null);

  const topicContext = useTopicStoreContext();
  const roomContext = useRoomStoreContext();

  const isEditingAnyMessage = select(() => !!topicContext.editedMessageId);
  const replyingToMessageId = select(() => topicContext.currentlyReplyingToMessageId);

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
    const { data } = await createMessage({
      variables: {
        id: messageId,
        topicId,
        type,
        content,
        replied_to_message_id: topicContext.currentlyReplyingToMessageId,
      },
    });

    updateLastSeenMessage({ messageId, topicId });

    if (data) {
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
        ref={editorRef}
        isDisabled={isDisabled || isEditingAnyMessage}
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
    </UIEditorContainer>
  );
});

const UIEditorContainer = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
