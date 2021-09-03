import { gql, useMutation } from "@apollo/client";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import { useList, useLocalStorage } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { assertReadUserDataFromCookie } from "~frontend/authentication/cookie";
import { bindAttachmentsToMessage } from "~frontend/gql/attachments";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { EditorAttachmentInfo, uploadFiles } from "~frontend/ui/message/composer/attachments";
import { MessageComposerContext } from "~frontend/ui/message/composer/MessageComposerContext";
import { MessageContentEditor } from "~frontend/ui/message/composer/MessageContentComposer";
import { Recorder } from "~frontend/ui/message/composer/Recorder";
import { Message } from "~frontend/ui/message/messagesFeed/Message";
import { ReplyingToMessageById } from "~frontend/ui/message/reply/ReplyingToMessage";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import {
  CreateNewMessageMutation,
  CreateNewMessageMutationVariables,
  Message_Type_Enum,
  TopicWithMessagesQuery,
  TopicWithMessagesQueryVariables,
} from "~gql";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { assertDefined } from "~shared/assert";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { select, useAutorun } from "~shared/sharedState";
import { getUUID } from "~shared/uuid";

import { TOPIC_WITH_MESSAGES_QUERY } from "./gql";

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
          updated_at
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
            updated_at: new Date().toISOString(),
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
            replied_to_message: null,
          },
        };
      },
      update(cache, result) {
        const message = result.data?.message;
        if (!message) {
          return;
        }
        const options = {
          query: TOPIC_WITH_MESSAGES_QUERY,
          variables: { topicId: message.topic_id },
        };
        const data = cache.readQuery<TopicWithMessagesQuery, TopicWithMessagesQueryVariables>(options);
        if (data) {
          const { messages } = data;
          cache.writeQuery<TopicWithMessagesQuery, TopicWithMessagesQueryVariables>({
            ...options,
            data: {
              ...data,
              messages: messages.some((m) => m.id == message.id) ? messages : messages.concat(message),
            },
          });
        }
      },
    }
  );

export const CreateNewMessageEditor = observer(({ topicId, isDisabled, onMessageSent }: Props) => {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const [storedValue, setValue] = useLocalStorage<RichEditorNode>(
    "message-draft-for-topic:" + topicId,
    getEmptyRichContent()
  );
  const [createMessage, { loading: isCreatingMessage }] = useCreateMessageMutation();

  const value = assertDefined(storedValue, "useLocalStorage does not return undefined if given a default");

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
      </MessageComposerContext.Provider>
    </UIEditorContainer>
  );
});

const UIEditorContainer = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
