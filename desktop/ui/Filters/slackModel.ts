import { isNotNullish } from "@aca/shared/nullish";

import { NotificationFilterKind } from "./types";

type SlackFilter = NotificationFilterKind<"notification_slack_message">;

export interface ParsedSlackFilter {
  directMessages?:
    | { type: "everyone" }
    | { type: "selectedPeople"; selectedPeople: string[] }
    | {
        type: "excludedPeople";
        excludedPeople: string[];
      };
  mentions?:
    | { type: "everyChannel" }
    | { type: "selectedChannels"; selectedChannels: string[] }
    | {
        type: "excludedChannels";
        excludedChannels: string[];
      };
  anyMessages?: {
    channels: string[];
  };
}

export function compileSlackFilter({ anyMessages, directMessages, mentions }: ParsedSlackFilter): SlackFilter {
  const $or: SlackFilter["$or"] = [];
  type Criteria = NonNullable<SlackFilter["$or"]>[0];

  if (anyMessages) {
    $or.push({ is_mention: false, slack_conversation_id: { $in: anyMessages.channels } });
  }

  if (directMessages) {
    const criteria: Criteria = {
      conversation_type: { $in: ["im", "mpim"] },
    };

    if (directMessages.type === "everyone") {
      //
    } else if (directMessages.type === "excludedPeople") {
      criteria.slack_user_id = { $notIn: directMessages.excludedPeople };
    } else if (directMessages.type === "selectedPeople") {
      criteria.slack_user_id = { $in: directMessages.selectedPeople };
    }

    $or.push(criteria);
  }

  if (mentions) {
    const criteria: Criteria = {
      is_mention: true,
    };

    if (mentions.type === "everyChannel") {
      //
    } else if (mentions.type === "excludedChannels") {
      criteria.slack_conversation_id = { $notIn: mentions.excludedChannels };
    } else if (mentions.type === "selectedChannels") {
      criteria.slack_conversation_id = { $in: mentions.selectedChannels };
    }

    $or.push(criteria);
  }

  return {
    __typename: "notification_slack_message",
    $or,
  };
}

export function parseSlackFilter(filter: SlackFilter): ParsedSlackFilter {
  const { $or } = filter;

  const parsed: ParsedSlackFilter = {};

  if (!$or) return parsed;

  $or.forEach((criteria) => {
    // direct message
    if (criteria.conversation_type) {
      if (!criteria.slack_user_id) {
        parsed.directMessages = { type: "everyone" };
        return;
      }

      if (typeof criteria.slack_user_id === "string") {
        return;
      }

      if ("$in" in criteria.slack_user_id) {
        parsed.directMessages = {
          type: "selectedPeople",
          selectedPeople: criteria.slack_user_id.$in.filter(isNotNullish),
        };
        return;
      }

      if ("$notIn" in criteria.slack_user_id) {
        parsed.directMessages = {
          type: "excludedPeople",
          excludedPeople: criteria.slack_user_id.$notIn.filter(isNotNullish),
        };
      }
    }

    // mentions
    if (criteria.is_mention) {
      if (!criteria.slack_conversation_id) {
        parsed.mentions = { type: "everyChannel" };
        return;
      }

      if (typeof criteria.slack_conversation_id === "string") {
        return;
      }

      if ("$in" in criteria.slack_conversation_id) {
        parsed.mentions = {
          type: "selectedChannels",
          selectedChannels: criteria.slack_conversation_id.$in.filter(isNotNullish),
        };
      }

      if ("$notIn" in criteria.slack_conversation_id) {
        parsed.mentions = {
          type: "excludedChannels",
          excludedChannels: criteria.slack_conversation_id.$notIn.filter(isNotNullish),
        };
      }
    }

    // mentions
    if (criteria.is_mention === false) {
      parsed.anyMessages = {
        channels: [],
      };
      if (criteria.slack_conversation_id) {
        if (typeof criteria.slack_conversation_id === "string") {
          return;
        }

        if ("$in" in criteria.slack_conversation_id) {
          parsed.anyMessages = {
            channels: criteria.slack_conversation_id.$in.filter(isNotNullish),
          };
          return;
        }
      }
    }
  });

  return parsed;
}

export function isSlackFilterEmpty(filter: SlackFilter) {
  const { anyMessages, directMessages, mentions } = parseSlackFilter(filter);

  return !anyMessages && !directMessages && !mentions;
}
