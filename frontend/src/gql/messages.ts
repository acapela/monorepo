import { gql } from "@apollo/client";
import { assertReadUserDataFromCookie } from "~frontend/authentication/cookie";
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables,
  MessageBasicInfoFragment as MessageBasicInfoFragmentType,
  MessageDetailedInfoFragment as MessageDetailedInfoFragmentType,
  UpdateTextMessageMutation,
  UpdateTextMessageMutationVariables,
  MessageQuery,
  MessageQueryVariables,
} from "~gql";
import { getUUID } from "~shared/uuid";
import { AttachmentDetailedInfoFragment } from "./attachments";
import { topicMessagesQueryManager } from "./topics";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery } from "./utils";

export const MessageBasicInfoFragment = createFragment<MessageBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    fragment MessageBasicInfo on message {
      id
      createdAt: created_at
      content
      user {
        ...UserBasicInfo
      }
    }
  `
);

export const MessageDetailedInfoFragment = createFragment<MessageDetailedInfoFragmentType>(
  () => gql`
    ${AttachmentDetailedInfoFragment()}
    ${UserBasicInfoFragment()}

    fragment MessageDetailedInfo on message {
      id
      content
      createdAt: created_at
      content
      type
      replied_to_message_id
      transcription {
        status
        transcript
      }
      user {
        ...UserBasicInfo
      }
      message_attachments {
        attachment {
          ...AttachmentDetailedInfo
        }
      }
    }
  `
);

export const [useCreateMessageMutation, { mutate: createMessage }] = createMutation<
  CreateMessageMutation,
  CreateMessageMutationVariables
>(
  () => gql`
    ${MessageDetailedInfoFragment()}

    mutation CreateMessage(
      $topicId: uuid!
      $content: jsonb!
      $type: message_type_enum!
      $attachments: [message_attachment_insert_input!]!
      $replied_to_message_id: uuid
    ) {
      message: insert_message_one(
        object: {
          content: $content
          topic_id: $topicId
          type: $type
          message_attachments: { data: $attachments }
          replied_to_message_id: $replied_to_message_id
          is_draft: false
        }
      ) {
        ...MessageDetailedInfo
      }
    }
  `,
  {
    optimisticResponse(vars) {
      const userData = assertReadUserDataFromCookie();

      return {
        __typename: "mutation_root",
        message: {
          __typename: "message",
          createdAt: new Date().toISOString(),
          message_attachments: [],
          type: vars.type,
          user: {
            id: userData.id,
            __typename: "user",
            avatar_url: userData.picture,
            email: userData.email,
            name: userData.name,
          },
          id: getUUID(),
          content: vars.content,
          replied_to_message_id: vars.replied_to_message_id,
        },
      };
    },
    onResult: (message, variables) => {
      topicMessagesQueryManager.update({ topicId: variables.topicId }, (current) => {
        if (!message) {
          return;
        }
        current.messages.push(message);
      });
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
  `
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

export const [useMessageQuery, messageQueryManager] = createQuery<MessageQuery, MessageQueryVariables>(
  () => gql`
    ${MessageDetailedInfoFragment()}
    query Message($id: uuid!) {
      message: message_by_pk(id: $id) {
        ...MessageDetailedInfo
      }
    }
  `
);
