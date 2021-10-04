import { gql, useMutation } from "@apollo/client";
import { observer } from "mobx-react";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { assertReadUserDataFromCookie } from "~frontend/authentication/cookie";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { bindAttachmentsToMessage } from "~frontend/gql/attachments";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { EditorAttachmentInfo, uploadFiles } from "~frontend/ui/message/composer/attachments";
import { MessageContentEditor } from "~frontend/ui/message/composer/MessageContentComposer";
import { Recorder } from "~frontend/ui/message/composer/Recorder";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import { Message } from "~frontend/ui/message/messagesFeed/Message";
import { ReplyingToMessageById } from "~frontend/ui/message/reply/ReplyingToMessage";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import {
  CreateNewMessageMutation,
  CreateNewMessageMutationVariables,
  CreateNewTopicForMessageMutation,
  CreateNewTopicForMessageMutationVariables,
  Message_Type_Enum,
  TopicWithMessagesQuery,
  TopicWithMessagesQueryVariables,
} from "~gql";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { assert } from "~shared/assert";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { select, useAutorun } from "~shared/sharedState";
import { slugify } from "~shared/slugify";
import { DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH, truncateTextWithEllipsis } from "~shared/text/ellipsis";
import { getUUID } from "~shared/uuid";
import { theme } from "~ui/theme";

import { TOPIC_WITH_MESSAGES_QUERY } from "./gql";

interface Props {
  topicId?: string;
  isDisabled?: boolean;
  requireMention: boolean;
  onMessageSent: (messageData: NonNullable<CreateNewMessageMutation["message"]>) => void;
}

interface SubmitMessageParams {
  type: Message_Type_Enum;
  content: RichEditorNode;
  attachments: EditorAttachmentInfo[];
}

function pickFirstLineFromPlainTextContent(plainTextContent: string): string {
  return plainTextContent.split("\n")[0];
}

const useCreateNewTopicForMessage = () => {
  const user = useAssertCurrentUser();
  const teamId = useCurrentTeamId();
  const [createNewTopic] = useMutation<CreateNewTopicForMessageMutation, CreateNewTopicForMessageMutationVariables>(gql`
    mutation CreateNewTopicForMessage($input: topic_insert_input!) {
      topic: insert_topic_one(object: $input) {
        id
      }
    }
  `);

  async function createNewTopicForMessageContent(content: RichEditorNode) {
    const contentPlainText = convertMessageContentToPlainText(content);

    const titleFromPlainText = pickFirstLineFromPlainTextContent(contentPlainText);

    const truncatedTitle = truncateTextWithEllipsis(titleFromPlainText, DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH);

    const slug = slugify(truncatedTitle);

    const newTopicCreationResult = await createNewTopic({
      variables: {
        input: {
          id: getUUID(),
          name: truncatedTitle,
          owner_id: user.id,
          team_id: teamId,
          slug,
          index: "",
        },
      },
    });

    const newTopic = newTopicCreationResult.data?.topic ?? null;

    return newTopic;
  }

  return createNewTopicForMessageContent;
};

const useCreateMessageMutation = () => {
  return useMutation<CreateNewMessageMutation, CreateNewMessageMutationVariables>(
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
};

function useLocalStorageState<S>({
  key,
  getInitialValue,
  checkShouldStore,
}: {
  key: string;
  getInitialValue: () => S;
  checkShouldStore: (value: S) => boolean;
}): [S, Dispatch<SetStateAction<S>>] {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : getInitialValue;
  });

  useEffect(() => {
    if (checkShouldStore(value)) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }, [value, checkShouldStore, key]);

  return [value, setValue];
}

export const CreateNewMessageEditor = observer(({ topicId, isDisabled, onMessageSent, requireMention }: Props) => {
  const editorRef = useRef<Editor>(null);

  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

  const checkShouldStore = useCallback(() => Boolean(editorRef.current && !editorRef.current.isEmpty), []);
  const [value, setValue] = useLocalStorageState<RichEditorNode>({
    key: "message-draft-for-topic:" + (topicId ?? "new-topic"),
    getInitialValue: getEmptyRichContent,
    checkShouldStore,
  });
  const [createMessage, { loading: isCreatingMessage }] = useCreateMessageMutation();
  const createNewTopicForMessage = useCreateNewTopicForMessage();

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

    return validator(value);
  }, [shouldValidateOnChange, validator, value]);

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
    /**
     * We'll either use topicId provided from props, or if not provided - will create new topic.
     * New topic title will be created from first 'paragraph' of plain text content in the message.
     */
    let finalTopicId = topicId;

    if (!finalTopicId) {
      const newTopicForMessage = await createNewTopicForMessage(content);

      finalTopicId = newTopicForMessage?.id;
    }

    assert(
      finalTopicId,
      "Cannot create new message - no topicId provided and could not create new topic for this message"
    );

    const { data } = await createMessage({
      variables: {
        id: messageId,
        topicId: finalTopicId,
        type,
        content,
        replied_to_message_id: topicContext?.currentlyReplyingToMessageId,
      },
    });

    if (!data?.message) {
      console.warn(`Failed to create message`);
      return;
    }

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

    onMessageSent(data.message);
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

          if (validator(value)) {
            setShouldValidateOnChange(true);
            return;
          }

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
  color: ${theme.colors.layout.supportingText()};
  ${theme.font.body14.build()};
`;

const UIEditorContainer = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;
