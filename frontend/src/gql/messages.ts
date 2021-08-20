import { gql } from "@apollo/client";

import {
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables,
  MessageBasicInfoFragment as MessageBasicInfoFragmentType,
  MessageDetailedInfoFragment as MessageDetailedInfoFragmentType,
  MessageFeedInfoFragment as MessageFeedInfoFragmentType,
  UpdateTextMessageMutation,
  UpdateTextMessageMutationVariables,
} from "~gql";

import { AttachmentDetailedInfoFragment } from "./attachments";
import { ReactionBasicInfoFragment } from "./reactions";
import { UserBasicInfoFragment } from "./user";
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

    fragment MessageDetailedInfo on message {
      ...MessageBasicInfo

      message_attachments {
        ...AttachmentDetailedInfo
      }
      message_reactions {
        ...ReactionBasicInfo
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
