import { gql } from "@apollo/client";
import {
  ReactionBasicInfoFragment as ReactionBasicInfoFragmentType,
  AddMessageReactionMutation,
  AddMessageReactionMutationVariables,
  RemoveMessageReactionMutation,
  RemoveMessageReactionMutationVariables,
} from "~gql";
import { createFragment, createMutation } from "./utils";
import { UserBasicInfoFragment } from "./user";

export const ReactionBasicInfoFragment = createFragment<ReactionBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}

    fragment ReactionBasicInfo on message_reaction {
      emoji
      user {
        ...UserBasicInfo
      }
    }
  `
);

export const [useAddMessageReaction, { mutate: addMessageReaction }] = createMutation<
  AddMessageReactionMutation,
  AddMessageReactionMutationVariables
>(
  () => gql`
    ${ReactionBasicInfoFragment()}

    mutation AddMessageReaction($input: message_reaction_insert_input!) {
      insert_message_reaction_one(object: $input) {
        ...ReactionBasicInfo
      }
    }
  `
);

export const [useRemoveMessageReaction, { mutate: removeMessageReaction }] = createMutation<
  RemoveMessageReactionMutation,
  RemoveMessageReactionMutationVariables
>(
  () => gql`
    mutation RemoveMessageReaction($emoji: String!, $messageId: uuid!, $userId: uuid!) {
      delete_message_reaction_by_pk(emoji: $emoji, message_id: $messageId, user_id: $userId) {
        message_id
      }
    }
  `
);
