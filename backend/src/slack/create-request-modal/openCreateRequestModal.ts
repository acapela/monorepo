import { ViewStateValue } from "@slack/bolt";
import { upperFirst, without } from "lodash";
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
import { DECISION_BLOCK_ID_PRE, excludeBotUsers, getDecisionBlockCount, pickRealUsersFromMessageText } from "./utils";

const buildOptionFromRequestType = (value: RequestType) =>
  Bits.Option({ value, text: MENTION_TYPE_PICKER_LABELS[value] });

export const CreateRequestModal = async (
  token: string,
  metadata: ViewMetadata["open_create_request_modal"],
  stateValues?: {
    [blockId: string]: {
      [actionId: string]: ViewStateValue;
    };
  }
) => {
  const { channelId, slackUserId, messageText } = metadata;

  let requestToSlackUserIds: string[] = [];
  if (!stateValues) {
    // we only need to do the following for setting initial values, where stateValues is not set yet
    const slackUserIdsFromMessage = await pickRealUsersFromMessageText(token, messageText);
    const slackUserIdsFromMessageWithoutSelf = without(slackUserIdsFromMessage, slackUserId);

    const channelInfo = await getChannelInfo(token, channelId);
    if (channelInfo) channelInfo.members = without(channelInfo.members, slackUserId);

    requestToSlackUserIds = slackUserIdsFromMessageWithoutSelf;

    // if there is no real user mentioned prefill all channel members
    if (requestToSlackUserIds.length === 0 && channelInfo && channelInfo.isPrivate) {
      requestToSlackUserIds = channelInfo.members;
    }
  }

  const isDecision = stateValues?.request_type_block?.request_type_select?.selected_option?.value == REQUEST_DECISION;

  return Modal({ title: "Create a new request", ...attachToViewWithMetadata("create_request", metadata) })
    .blocks(
      Blocks.Input({ blockId: "request_type_block", label: "Request Type" })
        .dispatchAction(true)
        .element(
          Elements.StaticSelect({ actionId: "request_type_select" })
            .initialOption(buildOptionFromRequestType(REQUEST_ACTION))
            .options(
              Object.keys(MENTION_TYPE_PICKER_LABELS)
                .filter((value) => value !== MENTION_OBSERVER)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map(buildOptionFromRequestType as any)
            )
        ),

      Blocks.Input({ blockId: "members_block", label: "Request to" }).element(
        Elements.UserMultiSelect({ actionId: "members_select" }).initialUsers(requestToSlackUserIds ?? [])
      ),
      messageText
        ? Blocks.Section({
            text: Md.bold(isDecision ? "Decision to be made" : "Your Message") + "\n" + Md.blockquote(messageText),
          })
        : Blocks.Input({
            label: isDecision ? "Decision to be made" : "Your Message",
            blockId: "message_block",
          }).element(Elements.TextInput({ actionId: "message_text" }).multiline(true)),
      isDecision
        ? [
            ...Array.from({ length: getDecisionBlockCount(stateValues) }, (_, i) =>
              Blocks.Input({ blockId: DECISION_BLOCK_ID_PRE + i, label: "Option " + (i + 1) })
                .element(Elements.TextInput({ actionId: "decision_input_" + i }).initialValue(["Yes", "No"][i]))
                .optional(i > 1)
            ),
            Blocks.Actions().elements(
              Elements.Button({ actionId: "request-modal-add-option", text: "Add another option" })
            ),
          ]
        : undefined,
      Blocks.Input({ blockId: "priority_block", label: "Priority" })
        .element(
          Elements.StaticSelect({ actionId: "priority", placeholder: "No priority" }).options(
            ["critical", "high", "medium", "low"].map((priority) =>
              Bits.Option({ value: priority, text: upperFirst(priority) })
            )
          )
        )
        .optional(true),
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
  await slackClient.views.open({ token, trigger_id: triggerId, view: await CreateRequestModal(token, data) });
}
