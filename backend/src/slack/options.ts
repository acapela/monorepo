import * as SlackBolt from "@slack/bolt";

import { db } from "~db";
import { isNullish } from "~shared/nullish";

export function setupSlackOptions(slackApp: SlackBolt.App) {
  slackApp.options("select_space", async ({ options, ack }) => {
    // Get information specific to a team or channel
    if (isNullish(options.team)) {
      return await ack();
    }
    try {
      const spaces = await db.space.findMany({
        where: { team: { team_slack_installation: { slack_team_id: options.team.id } } },
      });

      const spaceOptions: SlackBolt.Option[] = spaces.map((space) => {
        return {
          text: {
            type: "plain_text",
            text: space.name,
          },
          value: space.id,
        };
      });
      await ack({
        options: spaceOptions,
      });
    } catch (e) {
      console.error(e);
      return await ack();
    }
  });
}
