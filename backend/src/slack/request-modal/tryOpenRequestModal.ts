import { View } from "@slack/types";
import { uniq } from "lodash";
import { Bits, Blocks, Elements, Md, Modal } from "slack-block-builder";

import { db } from "~db";
import { routes } from "~shared/routes";
import { checkHasAllSlackUserScopes } from "~shared/slack";
import { Maybe } from "~shared/types";
import { MENTION_OBSERVER, MENTION_TYPE_PICKER_LABELS, REQUEST_READ } from "~shared/types/mention";

import { SlackInstallation, slackClient } from "../app";
import { isChannelNotFoundError } from "../errors";
import { createSlackLink } from "../md/utils";
import { ViewMetadata, attachToViewWithMetadata, findUserBySlackId } from "../utils";

const MissingTeamModal = Modal({ title: "Four'O'Four" })
  .blocks(
    Blocks.Section({
      text: [
        "Your team's Slack is not connected with Acapela yet.",
        `Head to your team's <${process.env.FRONTEND_URL + routes.settings}|settings page> to change that.`,
      ].join(" "),
    })
  )
  .buildToObject();

const AuthForTopicModal = async (viewData: ViewMetadata["open_request_modal"]) =>
  Modal({
    title: "Please authorize Acapela",
    submit: "Try again",
    ...attachToViewWithMetadata("open_request_modal", viewData),
  })
    .blocks(
      Blocks.Section({
        text: [
          "It's not you, it's us! We added some new functionality to our Acapela Slack app which requires authorizing the app.",
          "This is a normal step of the process when permissions change.",
        ].join(" "),
      }),
      Blocks.Section({
        text: `Head over to ${createSlackLink(
          process.env.FRONTEND_URL + routes.settings,
          "your Acapela settings"
        )} to authorize it.`,
      }),
      viewData.messageText
        ? [Blocks.Divider(), Blocks.Section().text("Your Request Message:\n" + Md.blockquote(viewData.messageText))]
        : undefined
    )
    .buildToObject();

const TopicModal = (metadata: ViewMetadata["create_request"]) => {
  const { messageText, requestToSlackUserIds } = metadata;
  return Modal({ title: "Create a new request", ...attachToViewWithMetadata("create_request", metadata) })
    .blocks(
      Blocks.Input({ blockId: "request_type_block", label: "Request Type:" }).element(
        Elements.StaticSelect({ actionId: "request_type_select" })
          .initialOption(Bits.Option({ value: REQUEST_READ, text: MENTION_TYPE_PICKER_LABELS[REQUEST_READ] }))
          .optionGroups(
            Bits.OptionGroup({ label: "Request types" }).options(
              Object.entries(MENTION_TYPE_PICKER_LABELS)
                .filter(([value]) => value !== MENTION_OBSERVER)
                .map(([value, text]) => Bits.Option({ value, text }))
            )
          )
          .optionGroups(
            Bits.OptionGroup({ label: "Non-request types" }).options(
              Bits.Option({
                value: MENTION_OBSERVER,
                text: MENTION_TYPE_PICKER_LABELS[MENTION_OBSERVER],
              })
            )
          )
      ),
      Blocks.Section({ blockId: "members_block", text: "Request to:" }).accessory(
        Elements.UserMultiSelect({ actionId: "members_select" }).initialUsers(requestToSlackUserIds ?? [])
      ),
      messageText
        ? Blocks.Section({
            text: Md.bold("Your Message:") + "\n" + Md.blockquote(messageText),
          })
        : Blocks.Input({ label: "Your Message", blockId: "message_block" }).element(
            Elements.TextInput({ actionId: "message_text" }).multiline(true)
          ),
      Blocks.Input({ blockId: "topic_block", label: "Request Title" })
        .element(Elements.TextInput({ actionId: "topic_name", placeholder: "Eg feedback for Figma v12" }))
        .optional(true),
      metadata.channelId
        ? undefined
        : Blocks.Input({ label: "Post in channel", blockId: "channel_block" })
            .element(Elements.ChannelSelect({ actionId: "channel_select" }))
            .optional(true)
    )
    .submit("Create")
    .buildToObject();
};

async function checkHasChannelAccess(token: string, channelId: string) {
  try {
    await slackClient.conversations.info({ token, channel: channelId });
    return true;
  } catch (error) {
    if (isChannelNotFoundError(error)) {
      return false;
    } else {
      throw error;
    }
  }
}

async function checkHasTeamMemberAllSlackUserScopes(slackUserId: string) {
  const teamMemberSlack = await db.team_member_slack.findFirst({ where: { slack_user_id: slackUserId } });
  const installationData = teamMemberSlack?.installation_data as Maybe<SlackInstallation["user"]>;
  return checkHasAllSlackUserScopes(installationData?.scopes ?? []);
}

async function filterBotUsers(token: string, userIds: string[]): Promise<string[]> {
  const filtered = [];
  for (const userId of userIds) {
    const slackUserRes = await slackClient.users.info({
      token,
      user: userId,
    });
    if (!slackUserRes.ok) continue;
    if (!slackUserRes.user?.is_bot) filtered.push(userId);
  }
  return filtered;
}

export async function tryOpenRequestModal(token: string, triggerId: string, data: ViewMetadata["open_request_modal"]) {
  const { channelId, messageTs, slackUserId, slackTeamId, messageText, origin, fromMessageBelongingToSlackUserId } =
    data;
  const openView = (view: View) => slackClient.views.open({ token, trigger_id: triggerId, view });

  const [user, team] = await Promise.all([
    findUserBySlackId(token, slackUserId),
    db.team.findFirst({ where: { team_slack_installation: { slack_team_id: slackTeamId } } }),
  ]);
  if (!team) {
    await openView(MissingTeamModal);
    return { user };
  }

  const [hasChannelAccess, hasSlackScopes] = await Promise.all([
    !channelId || checkHasChannelAccess(token, channelId),
    checkHasTeamMemberAllSlackUserScopes(slackUserId),
  ]);

  if (!user || !hasChannelAccess || !hasSlackScopes) {
    await openView(await AuthForTopicModal(data));
    return { user };
  }

  let requestToSlackUserIds = await filterBotUsers(
    token,
    messageText ? uniq(Array.from(messageText.matchAll(/<@(.+?)\|/gm)).map(({ 1: slackUserId }) => slackUserId)) : []
  );

  // if there is no real user mentioned add all channel members
  if (requestToSlackUserIds.length === 0 && channelId) {
    const response = await slackClient.conversations.members({ token, channel: channelId });
    if (response.ok && response.members) requestToSlackUserIds = await filterBotUsers(token, response.members);
  }

  await openView(
    TopicModal({
      messageText,
      channelId,
      messageTs,
      origin,
      fromMessageBelongingToSlackUserId,
      requestToSlackUserIds,
    })
  );

  return { user };
}
