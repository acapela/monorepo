import { gql } from "@apollo/client";

import { withFragments } from "~frontend/gql/utils";
import { GroupReactionsByEmoji_ReactionFragment } from "~gql";

type Reaction = GroupReactionsByEmoji_ReactionFragment;

const fragments = {
  message_reaction: gql`
    fragment GroupReactionsByEmoji_reaction on message_reaction {
      emoji
    }
  `,
};
export const groupReactionsByEmoji = withFragments(fragments, (reactions: Reaction[]): Record<string, Reaction[]> => {
  return reactions.reduce((acc: Record<string, Reaction[]>, reaction) => {
    acc[reaction.emoji] = acc[reaction.emoji] || [];

    acc[reaction.emoji].push(reaction);

    return acc;
  }, {});
});
