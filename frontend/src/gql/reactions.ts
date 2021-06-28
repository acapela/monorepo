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
import { MessageDetailedInfoFragment } from "./messages";

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
  `,
  {
    optimisticResponse({ input }) {
      return {
        __typename: "mutation_root",
        topic: {
          __typename: "message_reaction",
          emoji: input.emoji,
          message_id: input.message_id,
          user_id: input.user_id,
        },
      };
    },
    onOptimisticOrActualResponse(messageReaction, { input }) {
      if (!input.message_id) {
        return;
      }

      MessageDetailedInfoFragment.update(input.message_id, (data) => {
        data.message_reactions.push(messageReaction);
      });
    },
  }
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
  `,
  {
    optimisticResponse(variables) {
      return {
        __typename: "mutation_root",
        delete_message_reaction_by_pk: {
          __typename: "message_reaction",
          emoji: variables.emoji,
          message_id: variables.messageId,
          user_id: variables.userId,
        },
      };
    },
    onOptimisticOrActualResponse(messageReaction, variables) {
      MessageDetailedInfoFragment.update(variables.messageId, (message) => {
        message.message_reactions = message.message_reactions.filter(
          (reaction) => reaction.emoji !== variables.emoji && reaction.user.id !== variables.userId
        );
      });
    },
  }
);
