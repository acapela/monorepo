import * as SlackBolt from "@slack/bolt";

import { createTopicForSlackUsers } from "~backend/src/slack/createTopicForSlackUsers";
import { db } from "~db";
import { assert } from "~shared/assert";
import { DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH, truncateTextWithEllipsis } from "~shared/text/ellipsis";
import { REQUEST_READ, REQUEST_RESPONSE } from "~shared/types/mention";

import { createAuthModalView, findUserBySlackId } from "./utils";

/**
 * Turns a text like "Hi <@123SOMEID456|gregor>, let's talk in <#13CHNID36|dev>" into "Hi @gregor, let's talk in #dev"
 * It does so by matching with a (hopefully) simple enough regex matching for these texts and the inner symbol and name.
 */
const USER_OR_CHANNEL_REGEX = /<(@|#).+?\|(.+?)>/gm;
function stringifySlackText(originalText: string) {
  const matches = Array.from(originalText.matchAll(USER_OR_CHANNEL_REGEX));
  return matches.reduce(
    ({ text, offset }, { 0: fullMatch, 1: symbol, 2: name, index }) => {
      if (!index) {
        return { text, offset };
      }
      const offsetIndex = index + offset;
      return {
        text: text.slice(0, offsetIndex) + symbol + name + text.slice(offsetIndex + fullMatch.length),
        offset: offset + symbol.length + name.length - fullMatch.length,
      };
    },
    {
      text: originalText,
      offset: 0,
    }
  ).text;
}

export function setupSlackCommands(slackApp: SlackBolt.App) {
  slackApp.command("/" + process.env.SLACK_SLASH_COMMAND, async ({ command, ack, respond, client, context, body }) => {
    const [user, team] = await Promise.all([
      findUserBySlackId(context.botToken || body.token, command.user_id),
      db.team.findFirst({ where: { team_slack_installation: { slack_team_id: command.team_id } } }),
    ]);
    if (!user) {
      await ack();
      await client.views.open(createAuthModalView({ triggerId: command.trigger_id }));
      return;
    }

    assert(team, "must have a team");

    // we want to create read-only requests for all users mentioned after "cc"/"cc:"
    const ccIndex = body.text.search(/\scc(\s|:)/gm);
    const slackUserIdsWithRequestType = Array.from(body.text.matchAll(/<@(.+?)\|/gm)).map(
      ({ 1: slackUserId, index }) =>
        ({
          slackUserId,
          requestType: index && ccIndex !== -1 && index > ccIndex ? REQUEST_READ : REQUEST_RESPONSE,
        } as const)
    );

    const topicMessage = stringifySlackText(body.text);
    const topic = await createTopicForSlackUsers({
      token: context.botToken || body.token,
      teamId: team.id,
      ownerId: user.id,
      topicName: truncateTextWithEllipsis(topicMessage, DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH),
      topicMessage,
      slackUserIdsWithRequestType,
    });
    const topicURL = `${process.env.FRONTEND_URL}/dashboard/${topic.id}`;
    await ack();
    await respond({
      response_type: "in_channel",
      text: `<@${command.user_id}> has created a new request using Acapela!\n${topicURL}`,
    });
  });
}
