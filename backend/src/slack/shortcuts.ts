import { App, GlobalShortcut, MessageShortcut, SlackShortcut } from "@slack/bolt";
import { ViewsOpenArguments, WebClient } from "@slack/web-api";

import { db } from "~db";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { AnalyticsEventsMap } from "~shared/types/analytics";

const ACAPELA_GLOBAL = { callback_id: "global_acapela", type: "shortcut" } as const as GlobalShortcut;
const ACAPELA_MESSAGE = { callback_id: "message_acapela", type: "message_action" } as const as MessageShortcut;

const createRoomModalViewOpen = (shortcut: SlackShortcut): ViewsOpenArguments => ({
  trigger_id: shortcut.trigger_id,
  view: {
    type: "modal",
    callback_id: "create_room_modal",
    title: {
      type: "plain_text",
      text: "Create a new room",
    },
    close: {
      type: "plain_text",
      text: "Close",
    },
    blocks: [
      {
        type: "input",
        block_id: "space_block",
        label: {
          type: "plain_text",
          text: "Pick the space for the discussion",
        },
        element: {
          type: "external_select",
          action_id: "select_space",
          placeholder: {
            type: "plain_text",
            text: "Select a Space",
          },
          min_query_length: 2,
        },
      },
      {
        type: "input",
        block_id: "room_block",
        label: {
          type: "plain_text",
          text: "Enter room name",
        },
        element: {
          type: "plain_text_input",
          action_id: "room_name",
          placeholder: {
            type: "plain_text",
            text: "Eg design discussion",
          },
        },
      },
      {
        type: "input",
        block_id: "topic_block",
        label: {
          type: "plain_text",
          text: "Enter topic name",
        },
        element: {
          type: "plain_text_input",
          action_id: "topic_name",
          placeholder: {
            type: "plain_text",
            text: "Eg feedback for Figma v12",
          },
        },
      },
      {
        type: "input",
        block_id: "message_block",
        label: {
          type: "plain_text",
          text: "Message to start the discussion",
        },
        element: {
          type: "plain_text_input",
          action_id: "topic_message",
          multiline: true,
          initial_value: shortcut.type == "message_action" ? shortcut.message.text : "",
          placeholder: {
            type: "plain_text",
            text: "Message to start the discussion",
          },
        },
      },
      {
        type: "section",
        block_id: "members_block",
        text: {
          type: "mrkdwn",
          text: "Add members from Slack",
        },
        accessory: {
          action_id: "members_select",
          type: "multi_users_select",
          placeholder: {
            type: "plain_text",
            text: "Select users",
          },
        },
      },
    ],
    submit: {
      type: "plain_text",
      text: "Create a new room",
    },
    private_metadata: JSON.stringify(shortcut as SlackShortcut),
  },
});

async function trackStartCreatingRoom(client: WebClient, slackUserId: string, eventName: keyof AnalyticsEventsMap) {
  let user = await db.user.findFirst({
    where: { team_member: { some: { team_member_slack_installation: { slack_user_id: slackUserId } } } },
  });
  if (!user) {
    const { profile } = await client.users.profile.get({ user: slackUserId });
    if (!profile) {
      return;
    }
    user = await db.user.findFirst({ where: { email: profile.email } });
  }
  if (user) {
    trackBackendUserEvent(user.id, eventName);
  }
}

export function setupSlackShortcuts(slackApp: App) {
  slackApp.action("select_space", ({ ack }) => ack());
  slackApp.action("members_select", ({ ack }) => ack());

  slackApp.shortcut(ACAPELA_GLOBAL, async ({ shortcut, ack, client, body }) => {
    await ack();
    await client.views.open(createRoomModalViewOpen(shortcut));
    await trackStartCreatingRoom(client, body.user.id, "Started creating Room with Slack Global Shortcut");
  });

  slackApp.shortcut(ACAPELA_MESSAGE, async ({ shortcut, ack, client, body }) => {
    await ack();
    await client.views.open(createRoomModalViewOpen(shortcut));
    await trackStartCreatingRoom(client, body.user.id, "Started creating Room with Slack Message Action");
  });
}
