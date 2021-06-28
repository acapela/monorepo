import { ReactionBasicInfoFragment } from "~gql";

export const groupReactionsByEmoji = (
  reactions: ReactionBasicInfoFragment[]
): Record<string, ReactionBasicInfoFragment[]> => {
  return reactions.reduce((acc: Record<string, ReactionBasicInfoFragment[]>, reaction) => {
    acc[reaction.emoji] = acc[reaction.emoji] || [];

    acc[reaction.emoji].push(reaction);

    return acc;
  }, {});
};
