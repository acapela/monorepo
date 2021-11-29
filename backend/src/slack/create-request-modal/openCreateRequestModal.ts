import type { View } from "@slack/types";
import { compact, uniq, without } from "lodash";
import { Bits, Blocks, Elements, Md, Modal } from "slack-block-builder";

import { getSlackInstallURL } from "~backend/src/slack/install";
import { db } from "~db";
import { routes } from "~shared/routes";
import { checkHasAllSlackUserScopes } from "~shared/slack";
import { Maybe } from "~shared/types";
import { MENTION_OBSERVER, MENTION_TYPE_PICKER_LABELS, REQUEST_READ } from "~shared/types/mention";

import { SlackInstallation, slackClient } from "../app";
import { isChannelNotFoundError } from "../errors";
import { createSlackLink } from "../md/utils";
import { ChannelInfo, ViewMetadata, attachToViewWithMetadata, findUserBySlackId } from "../utils";

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

const AuthForCreateRequestModal = async (
  token: string,
  viewData: ViewMetadata["open_create_request_modal"],
  teamId: string
) => {
  const user = await findUserBySlackId(token, viewData.slackUserId, teamId);
  return Modal({
    title: "Please authorize Acapela",
    submit: "Try again",
    ...attachToViewWithMetadata("open_create_request_modal", viewData),
  })
    .blocks(
      Blocks.Section({
        text: [
          "It's not you, it's us! We added some new functionality to our Acapela Slack app which requires authorizing the app.",
          "This is a normal step of the process when permissions change.",
        ].join(" "),
      }),
      Blocks.Section({
        text: `Head over ${createSlackLink(
          await getSlackInstallURL({ teamId, userId: user?.id }),
          "here"
        )} to authorize it and then try again.`,
      }),
      viewData.messageText
        ? [Blocks.Divider(), Blocks.Section().text("Your Request Message:\n" + Md.blockquote(viewData.messageText))]
        : undefined
    )
    .buildToObject();
};

const CreateRequestModal = (metadata: ViewMetadata["create_request"]) => {
  const { messageText, channelInfo, requestToSlackUserIds } = metadata;
  let channelInfoName = "";
  if (channelInfo?.conversationType === "direct") channelInfoName = "this direct message conversation";
  else if (channelInfo?.conversationType === "group") channelInfoName = "this group message conversation";
  else if (channelInfo?.name) channelInfoName = `#${channelInfo.name}`;

  return Modal({ title: "Create a new request", ...attachToViewWithMetadata("create_request", metadata) })
    .blocks(
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
      ),
      Blocks.Input({ blockId: "members_block", label: "Request to" }).element(
        Elements.UserMultiSelect({ actionId: "members_select" }).initialUsers(requestToSlackUserIds ?? [])
      ),
      messageText
        ? Blocks.Section({
            text: Md.bold("Your Message") + "\n" + Md.blockquote(messageText),
          })
        : Blocks.Input({ label: "Your Message", blockId: "message_block" }).element(
            Elements.TextInput({ actionId: "message_text" }).multiline(true)
          ),
      Blocks.Input({ blockId: "topic_block", label: "Request Title" })
        .element(Elements.TextInput({ actionId: "topic_name", placeholder: "Eg feedback for Figma v12" }))
        .optional(true),
      channelInfoName
        ? Blocks.Input({ blockId: "channel_observers_block", label: "Access rights" })
            .element(
              Elements.Checkboxes({ actionId: "channel_observers_checkbox" }).options(
                Bits.Option({
                  value: "include_channel_members",
                  text: `Give all Acapela members of ${channelInfoName} access to the request.`,
                })
              )
            )
            .optional(true)
        : undefined,
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

async function excludeBotUsers(token: string, userIds: string[]): Promise<string[]> {
  return compact(
    (
      await Promise.all(
        userIds.map((userId) =>
          slackClient.users.info({
            token,
            user: userId,
          })
        )
      )
    ).map((res) => res.ok && !res.user?.is_bot && res.user?.id)
  );
}

async function getChannelInfo(token: string, channelId: string | undefined): Promise<ChannelInfo> {
  if (!channelId) return null;

  const [infoRes, membersRes] = await Promise.all([
    slackClient.conversations.info({ token, channel: channelId }),
    slackClient.conversations.members({ token, channel: channelId }),
  ]);

  if (!infoRes.ok || !infoRes.channel || !membersRes.ok || !membersRes.members) return null;
  // ignore too large channels
  if (membersRes.members.length > 99) return null;

  return {
    members: await excludeBotUsers(token, membersRes.members),
    name: infoRes.channel.name,
    isPrivate: !!infoRes.channel.is_private || !!infoRes.channel.is_im,
    conversationType: infoRes.channel.is_mpim ? "group" : infoRes.channel.is_im ? "direct" : "channel",
  };
}

export async function openCreateRequestModal(
  token: string,
  triggerId: string,
  data: ViewMetadata["open_create_request_modal"]
) {
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
    await openView(await AuthForCreateRequestModal(token, data, team.id));
    return { user };
  }

  const slackUserIdsFromMessage = await excludeBotUsers(
    token,
    messageText
      ? without(
          uniq(Array.from(messageText.matchAll(/<@(.+?)\|/gm)).map(({ 1: slackUserId }) => slackUserId)),
          slackUserId
        )
      : []
  );

  const channelInfo = await getChannelInfo(token, channelId);
  if (channelInfo) channelInfo.members = without(channelInfo.members, slackUserId);

  let requestToSlackUserIds = slackUserIdsFromMessage;

  // if there is no real user mentioned prefill all channel members
  if (requestToSlackUserIds.length === 0 && channelInfo && channelInfo.isPrivate) {
    requestToSlackUserIds = channelInfo.members;
  }

  await openView(
    CreateRequestModal({
      messageText,
      channelId,
      channelInfo,
      messageTs,
      origin,
      fromMessageBelongingToSlackUserId,
      requestToSlackUserIds,
    })
  );

  return { user };
}
