import { App } from "@slack/bolt";
import { ViewsOpenArguments } from "@slack/web-api";
import { IncomingWebhook } from "@slack/webhook";
import { Bits, Blocks, Elements, Modal } from "slack-block-builder";

import { findUserBySlackId } from "~backend/src/slack/utils";
import { db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { routes } from "~shared/routes";
import { AnalyticsEventsMap } from "~shared/types/analytics";
import { MENTION_OBSERVER, MENTION_TYPE_PICKER_LABELS, MentionType, REQUEST_READ } from "~shared/types/mention";

import { createTopicForSlackUsers } from "./createTopicForSlackUsers";

export type TopicModalMetadata = { userId: string; origin: AnalyticsEventsMap["Created Topic"]["origin"] } & (
  | {}
  | { channelId: string; messageTs?: string; responseURL: string }
);

export const createTopicModalView = ({
  triggerId,
  messageText,
  slackUserIds,
  metadata,
}: {
  triggerId: string;
  messageText: string;
  slackUserIds?: string[];
  metadata: TopicModalMetadata;
}): ViewsOpenArguments => ({
  trigger_id: triggerId,
  view: Modal({ callbackId: "create_topic_modal", title: "Create a new request" })
    .blocks(
      Blocks.Input({ blockId: "topic_block", label: "Topic Title" }).element(
        Elements.TextInput({ actionId: "topic_name", placeholder: "Eg feedback for Figma v12" })
      ),
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
      Blocks.Input({ blockId: "message_block", label: "Request Message" }).element(
        Elements.TextInput({ actionId: "topic_message" }).multiline(true).initialValue(messageText)
      )
    )
    .submit("Create")
    .privateMetaData(JSON.stringify(metadata))
    .buildToObject(),
});

export function setupViews(app: App) {
  app.view("create_topic_modal", async ({ ack, view, body, client, context }) => {
    const {
      topic_block: {
        topic_name: { value: topicName },
      },
      message_block: {
        topic_message: { value: rawTopicMessage },
      },
      members_block: {
        members_select: { selected_users: members },
      },
      request_type_block: {
        request_type_select: { selected_option: requestType },
      },
    } = view.state.values;

    if (!(topicName && rawTopicMessage && members && requestType)) {
      return ack({
        response_action: "errors",
        errors: { room_block: "Sorry, this isn’t valid input" },
      });
    }

    const token = context.botToken || body.token;

    assert(body.user.team_id, "must have slack team id");

    const [team, owner] = await Promise.all([
      db.team.findFirst({ where: { team_slack_installation: { slack_team_id: body.user.team_id } } }),
      findUserBySlackId(token, body.user.id),
    ]);

    assert(team, "must have a team");
    assert(owner, "must have a user");

    const topic = await createTopicForSlackUsers({
      token,
      teamId: team.id,
      ownerId: owner.id,
      slackTeamId: body.user.team_id,
      topicName,
      rawTopicMessage,
      slackUserIdsWithRequestType: members.map((id) => ({
        slackUserId: id,
        requestType: requestType.value as MentionType,
      })),
    });

    if (!topic) {
      return await ack({
        response_action: "errors",
        errors: {
          email_address: "Topic creation failed",
        },
      });
    }

    await ack({ response_action: "clear" });

    const metadata = JSON.parse(view.private_metadata) as TopicModalMetadata;
    const topicURL = process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug });
    if ("responseURL" in metadata) {
      await new IncomingWebhook(metadata.responseURL).send({
        response_type: "in_channel",
        text: `<@${metadata.userId}> has created a new request using Acapela!\n${topicURL}`,
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
      } as never);
    } else {
      await client.chat.postMessage({
        channel: metadata.userId,
        text: `Your request was created on Acapela: ${topicURL}`,
      });
    }

    if (owner) {
      trackBackendUserEvent(owner.id, "Created Topic", {
        origin: metadata.origin,
        topicName: topicName,
      });
    }
  });
}
