import { MessageReactionEntity } from "~frontend/clientdb/messageReaction";

export const groupReactionsByEmoji = (reactions: MessageReactionEntity[]): Record<string, MessageReactionEntity[]> => {
  return reactions.reduce((acc: Record<string, MessageReactionEntity[]>, reaction) => {
    acc[reaction.emoji] = acc[reaction.emoji] || [];

    acc[reaction.emoji].push(reaction);

    return acc;
  }, {});
};
