import * as SlackBolt from "@slack/bolt";
import axios from "axios";

import { db } from "~db";
import { isNotNullish } from "~shared/nullish";

export function setupSlackEvents(slackApp: SlackBolt.App) {
  slackApp.shortcut({ callback_id: "message_acapela", type: "message_action" }, async ({ shortcut, ack, client }) => {
    try {
      // Acknowledge shortcut request
      await ack();
      // console.info(shortcut);
      // Call the views.open method using one of the built-in WebClients
      await client.views.open({
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
              type: "section",
              block_id: "space_block",
              text: {
                type: "mrkdwn",
                text: "Pick the space for the discussion",
              },
              accessory: {
                action_id: "select_space",
                type: "external_select",
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
                initial_value: shortcut.message.text,
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
          private_metadata: JSON.stringify({
            channelId: shortcut.channel.id,
            threadId: shortcut.message_ts,
            responseUrl: shortcut.response_url,
          }),
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
  slackApp.view("create_room_modal", async ({ ack, view, client, body }) => {
    // get the email value from the input block with `email_address` as the block_id
    const spaceId = view.state.values["space_block"]["select_space"].selected_option?.value;
    const roomName = view.state.values["room_block"]["room_name"].value;
    const topicName = view.state.values["topic_block"]["topic_name"].value;
    const topicMessage = view.state.values["message_block"]["topic_message"].value;
    const roomMembers = view.state.values["members_block"]["members_select"].selected_users;
    const { threadId, responseUrl } = JSON.parse(view.private_metadata);

    // if it’s valid input, accept the submission
    if (spaceId && roomName && topicName && topicMessage && roomMembers) {
      await ack();
      const memberQueries = roomMembers.map((memberId) => client.users.profile.get({ user: memberId }));
      const memberProfiles = await Promise.all(memberQueries);
      const users = await db.user.findMany({
        where: {
          email: { in: memberProfiles.map((response) => response.profile?.email).filter(isNotNullish) },
        },
      });
      const owner = await db.team_member.findFirst({
        where: { team_member_slack_installation: { slack_user_id: body.user.id } },
      });
      if (!owner) {
        return await ack({
          response_action: "errors",
          errors: {
            email_address: "Room creation failed",
          },
        });
      }
      const room = await db.room.create({
        data: {
          name: roomName,
          slug: roomName,
          creator_id: owner.user_id,
          owner_id: owner.user_id,
          space_id: spaceId,
          room_member: { createMany: { data: users.map((u) => ({ user_id: u.id })) } },
        },
      });
      if (!room) {
        return await ack({
          response_action: "errors",
          errors: {
            email_address: "Room creation failed",
          },
        });
      }
      // await client.chat.postMessage({
      //   channel: channelId,
      //   thread_ts: threadId,
      //   text: `Let's continue the discussion here: ${process.env.FRONTEND_URL}/space/${spaceId}/${room.id}`,
      //   token: context.userToken,
      //   reply_broadcast: true,
      // });
      // await context.respond({
      //   text: `Let's continue the discussion here: ${process.env.FRONTEND_URL}/space/${spaceId}/${room.id}`,
      //   thread_ts: threadId,
      //   token: context.userToken,
      //   reply_broadcast: true,
      // });
      await axios.post(responseUrl, {
        text: `Let's continue the discussion here: ${process.env.FRONTEND_URL}/space/${spaceId}/${room.id}`,
        thread_ts: threadId,
      });
    } else {
      // if it isn’t valid input, acknowledge with an error
      await ack({
        response_action: "errors",
        errors: {
          email_address: "Sorry, this isn’t valid input",
        },
      });
    }
  });
  slackApp.action("select_space", async ({ ack }) => {
    await ack();
  });
  slackApp.action("members_select", async ({ ack }) => {
    await ack();
  });
}
