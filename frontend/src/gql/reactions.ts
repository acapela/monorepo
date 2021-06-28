import { gql } from "@apollo/client";
import {
  ReactionBasicInfoFragment as ReactionBasicInfoFragmentType,
  AddMessageReactionMutation,
  AddMessageReactionMutationVariables,
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
