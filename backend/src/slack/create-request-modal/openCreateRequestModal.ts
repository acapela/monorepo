import type { View } from "@slack/types";
import { without } from "lodash";
import { Bits, Blocks, Elements, Md, Modal } from "slack-block-builder";

import { getTeamSlackInstallURL, getUserSlackInstallURL } from "~backend/src/slack/install";
import { db } from "~db";
import { routes } from "~shared/routes";
import { checkHasAllSlackUserScopes } from "~shared/slack";
import { Maybe } from "~shared/types";
import {
  MENTION_OBSERVER,
  MENTION_TYPE_PICKER_LABELS,
  REQUEST_ACTION,
  REQUEST_DECISION,
  RequestType,
} from "~shared/types/mention";

import { SlackInstallation, slackClient } from "../app";
import { isChannelNotFoundError } from "../errors";
import { createSlackLink } from "../md/utils";
import {
  ChannelInfo,
  ViewMetadata,
  attachToViewWithMetadata,
  checkHasSlackInstallationAllBotScopes,
  findUserBySlackId,
} from "../utils";
import { excludeBotUsers, pickOtherRealUsersFromMessageText } from "./utils";

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
  teamId: string,
  hasAllBotScopes: boolean
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
        text: `${createSlackLink(
          await (hasAllBotScopes ? getUserSlackInstallURL : getTeamSlackInstallURL)({ teamId, userId: user?.id }),
          ":arrow_right:  Link your Account (again)"
        )} to authorize it and then try again.`,
      }),
      viewData.messageText
        ? [Blocks.Divider(), Blocks.Section().text("Your Request Message:\n" + Md.blockquote(viewData.messageText))]
        : undefined
    )
    .buildToObject();
};

const buildOptionFromRequestType = (value: RequestType) =>
  Bits.Option({ value, text: MENTION_TYPE_PICKER_LABELS[value] });

const CreateRequestModal = (metadata: ViewMetadata["create_request"]) => {
  const { messageText, requestToSlackUserIds } = metadata;

  return Modal({ title: "Create a new request", ...attachToViewWithMetadata("create_request", metadata) })
    .blocks(
      Blocks.Input({ blockId: "request_type_block", label: "Request Type" }).element(
        Elements.StaticSelect({ actionId: "request_type_select" })
          .initialOption(buildOptionFromRequestType(REQUEST_ACTION))
          .options(
            Object.keys(MENTION_TYPE_PICKER_LABELS)
              //TODO: Decisions are still not supported in slack
              .filter((value) => value !== MENTION_OBSERVER && value !== REQUEST_DECISION)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map(buildOptionFromRequestType as any)
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
      Blocks.Input({ blockId: "due_at_date_block", label: "Due Date" })
        .element(Elements.DatePicker({ actionId: "due_at_date" }))
        .optional(true),
      Blocks.Input({ blockId: "due_at_hour_block", label: "Time" })
        .element(Elements.TimePicker({ actionId: "due_at_hour" }))
        .optional(true),
      Blocks.Input({ blockId: "topic_block", label: "Request Title" })
        .element(Elements.TextInput({ actionId: "topic_name", placeholder: "Eg feedback for Figma v12" }))
        .optional(true),
      metadata.channelId
        ? undefined
        : Blocks.Input({ label: "Post in channel", blockId: "conversation_block" })
            .element(
              Elements.ConversationSelect({ actionId: "conversation_select" }).defaultToCurrentConversation(true)
            )
            .optional(true)
    )
    .submit("Create")
    .buildToObject();
};

async function checkHasTeamMemberAllSlackUserScopes(slackUserId: string) {
  const teamMemberSlack = await db.team_member_slack.findFirst({ where: { slack_user_id: slackUserId } });
  const installationData = teamMemberSlack?.installation_data as Maybe<SlackInstallation["user"]>;
  return checkHasAllSlackUserScopes(installationData?.scopes ?? []);
}

async function checkHasChannelAccess(token: string, channelId: string, slackUserId: string) {
  try {
    const { channel } = await slackClient.conversations.info({ token, channel: channelId });
    const isPublic = channel?.is_channel && !channel.is_private;
    return isPublic || checkHasTeamMemberAllSlackUserScopes(slackUserId);
  } catch (error) {
    if (isChannelNotFoundError(error)) {
      return false;
    } else {
      throw error;
    }
  }
}

async function getChannelInfo(token: string, channelId: string | undefined): Promise<ChannelInfo> {
  if (!channelId) return null;

  const [infoRes, membersRes] = await Promise.all([
    slackClient.conversations.info({ token, channel: channelId }),
    slackClient.conversations.members({ token, channel: channelId }),
  ]);

  if (!infoRes.ok || !infoRes.channel || !membersRes.ok || !membersRes.members) return null;
  // ignore large channels, since we use members only for setting the default assignee
  // which is not useful for large channels
  if (membersRes.members.length > 10) return null;

  return {
    members: await excludeBotUsers(token, membersRes.members),
    isPrivate: !!infoRes.channel.is_private || !!infoRes.channel.is_im,
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
    db.team.findFirst({
      where: { team_slack_installation: { slack_team_id: slackTeamId } },
      include: { team_slack_installation: true },
    }),
  ]);
  if (!team) {
    await openView(MissingTeamModal);
    return { user };
  }

  const hasChannelAccess = !channelId || (await checkHasChannelAccess(token, channelId, slackUserId));

  const hasAllBotScopes = checkHasSlackInstallationAllBotScopes(team.team_slack_installation?.data);
  if (!hasChannelAccess || !hasAllBotScopes) {
    await openView(await AuthForCreateRequestModal(token, data, team.id, hasAllBotScopes));
    return { user };
  }

  const slackUserIdsFromMessage = await pickOtherRealUsersFromMessageText(token, slackUserId, messageText);

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
      slackUserIdsFromMessage,
    })
  );

  return { user };
}
