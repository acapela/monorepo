import { gql } from "@apollo/client";
import {
  ReactionBasicInfoFragment as ReactionBasicInfoFragmentType,
  AddMessageReactionMutation,
  AddMessageReactionMutationVariables,
} from "~gql";
import { createFragment, createMutation } from "./utils";

export const ReactionBasicInfoFragment = createFragment<ReactionBasicInfoFragmentType>(
  () => gql`
    fragment ReactionBasicInfo on message_reaction {
      emoji
      user {
        name
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

    mutation AddMessageReaction($object: message_reaction_insert_input!) {
      insert_message_reaction_one(object: $object) {
        ...ReactionBasicInfo
      }
    }
  `
);
