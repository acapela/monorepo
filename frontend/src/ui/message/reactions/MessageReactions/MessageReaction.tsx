import React from "react";
import { MessageDetailedInfoFragment, ReactionBasicInfoFragment } from "~gql";

interface Props {
  message: MessageDetailedInfoFragment;
  reaction: ReactionBasicInfoFragment;
}

export const MessageReaction = ({ message, reaction }: Props) => {
  return <p>{reaction.emoji}</p>;
};
