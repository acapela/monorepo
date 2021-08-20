import { gql } from "@apollo/client";

import { assertReadUserDataFromCookie } from "~frontend/authentication/cookie";
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables,
  MessageBasicInfoFragment as MessageBasicInfoFragmentType,
  MessageDetailedInfoFragment as MessageDetailedInfoFragmentType,
  MessageFeedInfoFragment as MessageFeedInfoFragmentType,
  UpdateTextMessageMutation,
  UpdateTextMessageMutationVariables,
} from "~gql";
import { getUUID } from "~shared/uuid";

import { AttachmentDetailedInfoFragment } from "./attachments";
import { ReactionBasicInfoFragment } from "./reactions";
import { TaskBasicInfoFragment } from "./tasks";
import { topicMessagesQueryManager, updateLastSeenMessage } from "./topics";
import { UserBasicInfoFragment, convertUserTokenDataToInfoFragment } from "./user";
import { createFragment, createMutation } from "./utils";

export const MessageBasicInfoFragment = createFragment<MessageBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    fragment MessageBasicInfo on message {
      id
      createdAt: created_at
      content
      type
      user {
        ...UserBasicInfo
      }
    }
  `
);

export const MessageDetailedInfoFragment = createFragment<MessageDetailedInfoFragmentType>(
  () => gql`
    ${MessageBasicInfoFragment()}
    ${AttachmentDetailedInfoFragment()}
    ${ReactionBasicInfoFragment()}
    ${TaskBasicInfoFragment()}

    fragment MessageDetailedInfo on message {
      ...MessageBasicInfo

      message_attachments {
        ...AttachmentDetailedInfo
      }
      message_reactions {
        ...ReactionBasicInfo
      }

      tasks {
        ...TaskBasicInfo
      }
    }
  `
);

export const MessageFeedInfoFragment = createFragment<MessageFeedInfoFragmentType>(
  () => gql`
    ${MessageDetailedInfoFragment()}

    fragment MessageFeedInfo on message {
      ...MessageDetailedInfo
      replied_to_message {
        ...MessageDetailedInfo
      }
    }
  `
);

export const [useCreateMessageMutation, { mutate: createMessage }] = createMutation<
  CreateMessageMutation,
  CreateMessageMutationVariables
>(
  () => gql`
    ${MessageFeedInfoFragment()}

    mutation CreateMessage(
      $id: uuid
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
          is_draft: false
        }
      ) {
        ...MessageFeedInfo
      }
    }
  `,
  {
    defaultVariables() {
      return { id: getUUID() };
    },
    optimisticResponse(vars) {
      const userData = assertReadUserDataFromCookie();

      function getRepliedMessageFragmentData() {
        if (!vars.replied_to_message_id) {
          return null;
        }
        return MessageDetailedInfoFragment.read(vars.replied_to_message_id);
      }

      return {
        __typename: "mutation_root",
        message: {
          __typename: "message",
          createdAt: new Date().toISOString(),
          message_attachments: [],
          type: vars.type,
          tasks: [],
          message_reactions: [],
          transcription: null,
          user: convertUserTokenDataToInfoFragment(userData),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: vars.id!,
          content: vars.content,
          replied_to_message: getRepliedMessageFragmentData(),
        },
      };
    },
    onOptimisticOrActualResponse: (message, variables) => {
      topicMessagesQueryManager.update({ topicId: variables.topicId }, (current) => {
        if (!message) {
          return;
        }
        current.messages.push(message);
      });
    },
    onActualResponse: (message, variables) => {
      // Each time user sends a new message, automatically mark it as read
      updateLastSeenMessage({ messageId: message.id, topicId: variables.topicId });
    },
  }
);

export const [useUpdateTextMessageMutation, { mutate: updateTextMessage }] = createMutation<
  UpdateTextMessageMutation,
  UpdateTextMessageMutationVariables
>(
  () => gql`
    ${MessageBasicInfoFragment()}

    mutation UpdateTextMessage($id: uuid!, $content: jsonb!, $isDraft: Boolean!) {
      update_message(where: { id: { _eq: $id } }, _set: { content: $content, is_draft: $isDraft }) {
        message: returning {
          ...MessageBasicInfo
        }
      }
    }
  `,
  {
    optimisticResponse({ content, id }) {
      const existing = MessageFeedInfoFragment.assertRead(id);
      return {
        __typename: "mutation_root",
        update_message: {
          __typename: "message_mutation_response",
          message: [{ ...existing, content }],
        },
      };
    },
  }
);

export const [useDeleteTextMessageMutation] = createMutation<
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables
>(
  () => gql`
    mutation DeleteTextMessage($id: uuid!) {
      delete_message(where: { id: { _eq: $id } }) {
        message: returning {
          id
        }
      }
    }
  `
);
