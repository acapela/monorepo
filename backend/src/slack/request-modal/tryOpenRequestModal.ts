import { View } from "@slack/types";
import { Bits, Blocks, Elements, Md, Modal } from "slack-block-builder";

import { createSlackLink } from "~backend/src/notifications/sendNotification";
import { db } from "~db";
import { routes } from "~shared/routes";
import { checkHasAllSlackUserScopes } from "~shared/slack";
import { Maybe } from "~shared/types";
import { MENTION_OBSERVER, MENTION_TYPE_PICKER_LABELS, REQUEST_READ } from "~shared/types/mention";

import { SlackInstallation, slackClient } from "../app";
import { isChannelNotFoundError } from "../errors";
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
    title: "Authorization missing!",
    submit: "Try again",
    ...attachToViewWithMetadata("open_request_modal", viewData),
  })
    .blocks(
      Blocks.Section({
        text:
          "⚠️ Before we can start a request, you need to authorize Acapela to work with Slack. " +
          `Head over to ${createSlackLink(
            process.env.FRONTEND_URL + routes.settings,
            "your Acapela settings"
          )} to link it.`,
      }),
      viewData.messageText
        ? [Blocks.Divider(), Blocks.Section().text("Your Request Message:\n" + Md.blockquote(viewData.messageText))]
        : undefined
    )
    .buildToObject();

const TopicModal = (metadata: ViewMetadata["create_request"]) => {
  const { messageText } = metadata;
  const slackUserIds = messageText
    ? Array.from(messageText.matchAll(/<@(.+?)\|/gm)).map(({ 1: slackUserId }) => slackUserId)
    : [];
  return Modal({ title: "Create a new request", ...attachToViewWithMetadata("create_request", metadata) })
    .blocks(
      metadata.channelId
        ? Blocks.Section({
            text:
              `${Md.bold("Note:")} Every user in this channel will be granted access to this request. ` +
              "If they do not have an Acapela account yet, they will be invited to join.",
          })
        : undefined,
      Blocks.Input({ blockId: "request_type_block", label: "Request Type" }).element(
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
      Blocks.Section({ blockId: "members_block", text: "Request to" }).accessory(
        Elements.UserMultiSelect({ actionId: "members_select" }).initialUsers(slackUserIds)
      ),
      messageText
        ? Blocks.Section({
            text: Md.bold("Your Message:") + "\n" + Md.blockquote(messageText),
          })
        : Blocks.Input({ label: "Your Message", blockId: "message_block" }).element(
            Elements.TextInput({ actionId: "message_text" }).multiline(true)
          ),
      Blocks.Input({ blockId: "topic_block", label: "Topic Title" })
        .element(Elements.TextInput({ actionId: "topic_name", placeholder: "Eg feedback for Figma v12" }))
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

export async function tryOpenRequestModal(token: string, triggerId: string, data: ViewMetadata["open_request_modal"]) {
  const { channelId, slackUserId, slackTeamId, messageText, origin } = data;
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

  await openView(TopicModal({ messageText, channelId, origin }));

  return { user };
}
