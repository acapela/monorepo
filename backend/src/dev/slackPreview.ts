import { Message } from "slack-block-builder";

import { createAuthorizedEndpointHandler } from "../endpoints/createEndpointHandler";
import { buildSummaryBlocksForUser } from "../slack/home-tab/content";

interface SlackPreviewInput {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SlackPreviewOutput = any;

export const slackBlocksPreviewHandler = createAuthorizedEndpointHandler<SlackPreviewInput, SlackPreviewOutput>(
  async (input) => {
    const blocks = await buildSummaryBlocksForUser(input.user.id, { includeWelcome: false });

    if (!blocks) {
      return null;
    }

    return Message()
      .blocks(...blocks)
      .buildToObject();
  }
);
