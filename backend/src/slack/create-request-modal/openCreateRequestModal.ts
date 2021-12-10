import type { View } from "@slack/types";
import { without } from "lodash";
import { Bits, Blocks, Elements, Md, Modal } from "slack-block-builder";

import {
  MENTION_OBSERVER,
  MENTION_TYPE_PICKER_LABELS,
  REQUEST_ACTION,
  REQUEST_DECISION,
  RequestType,
} from "~shared/types/mention";

import { slackClient } from "../app";
import { ChannelInfo, ViewMetadata, attachToViewWithMetadata } from "../utils";
import { excludeBotUsers, pickRealUsersFromMessageText } from "./utils";

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
  const { channelId, messageTs, slackUserId, messageText, origin, fromMessageBelongingToSlackUserId } = data;
  const openView = (view: View) => slackClient.views.open({ token, trigger_id: triggerId, view });

  const slackUserIdsFromMessage = await pickRealUsersFromMessageText(token, messageText);
  const slackUserIdsFromMessageWithoutSelf = without(slackUserIdsFromMessage, slackUserId);

  const channelInfo = await getChannelInfo(token, channelId);
  if (channelInfo) channelInfo.members = without(channelInfo.members, slackUserId);

  let requestToSlackUserIds = slackUserIdsFromMessageWithoutSelf;

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
      slackUserIdsFromMessage: slackUserIdsFromMessageWithoutSelf,
    })
  );
}
