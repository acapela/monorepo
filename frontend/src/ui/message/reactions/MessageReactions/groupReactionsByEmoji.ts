import { gql } from "@apollo/client";

import { withFragments } from "~frontend/gql/utils";
import { GroupReactionsByEmoji_ReactionFragment } from "~gql";

type Reaction = GroupReactionsByEmoji_ReactionFragment;

export const groupReactionsByEmoji = withFragments(
  {
    message_reaction: gql`
      fragment GroupReactionsByEmoji_reaction on message_reaction {
        emoji
      }
    `,
  },
  (reactions: Reaction[]): Record<string, Reaction[]> => {
    return reactions.reduce((acc: Record<string, Reaction[]>, reaction) => {
      acc[reaction.emoji] = acc[reaction.emoji] || [];

      acc[reaction.emoji].push(reaction);

      return acc;
    }, {});
  }
);
