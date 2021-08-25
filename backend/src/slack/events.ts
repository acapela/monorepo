import * as SlackBolt from "@slack/bolt";

import { getSlackInstallURL } from "~backend/src/slack/install";
import { isChannelNotFoundError } from "~backend/src/slack/utils";
import { db } from "~db";
import { assertDefined } from "~shared/assert";
import { isNotNullish } from "~shared/nullish";

const ACAPELA_MESSAGE = { callback_id: "message_acapela", type: "message_action" } as const;

const createPlainMessageContent = (text: string) => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text }] }],
});

export function setupSlackEvents(slackApp: SlackBolt.App) {
  slackApp.view("create_room_modal", async ({ ack, view, client, body, context }) => {
    const {
      space_block: {
        select_space: { selected_option: selectedSpace },
      },
      room_block: {
        room_name: { value: roomName },
      },
      topic_block: {
        topic_name: { value: topicName },
      },
      message_block: {
        topic_message: { value: topicMessage },
      },
      members_block: {
        members_select: { selected_users: roomMembers },
      },
    } = view.state.values;
    const spaceId = selectedSpace?.value;
    const { slackChannelId, slackThreadId } = JSON.parse(view.private_metadata);

    if (!(spaceId && roomName && topicName && topicMessage && roomMembers)) {
      return ack({
        response_action: "errors",
        errors: {
          email_address: "Sorry, this isn’t valid input",
        },
      });
    }

    const [, team, teamMember] = await Promise.all([
      ack(),
      db.team.findFirst({ where: { team_slack_installation: { slack_team_id: body.user.team_id } } }),
      db.team_member.findFirst({ where: { team_member_slack_installation: { slack_user_id: body.user.id } } }),
    ]);

    const memberQueries = roomMembers.map((memberId) => client.users.profile.get({ user: memberId }));
    const memberProfiles = await Promise.all(memberQueries);
    const users = await db.user.findMany({
      where: {
        email: { in: memberProfiles.map((response) => response.profile?.email).filter(isNotNullish) },
      },
    });

    const creatorId = assertDefined(teamMember?.user_id ?? team?.owner_id, "needs to at least have a team");
    const room = await db.room.create({
      data: {
        name: roomName,
        slug: roomName,
        creator_id: creatorId,
        owner_id: creatorId,
        space_id: spaceId,
        room_member: { createMany: { data: users.map((u) => ({ user_id: u.id })) } },
      },
    });
    const topic = await db.topic.create({
      data: {
        room_id: room.id,
        name: topicName,
        slug: topicName,
        index: "a",
        owner_id: creatorId,
        message: {
          createMany: {
            data: [
              {
                type: "TEXT",
                user_id: creatorId,
                content: createPlainMessageContent(topicMessage),
                content_text: topicMessage,
              },
            ],
          },
        },
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

    const roomURL = `${process.env.FRONTEND_URL}/space/${spaceId}/${room.id}/${topic.id}`;
    try {
      await client.chat.postMessage({
        token: context.userToken ?? context.botToken,
        channel: slackChannelId,
        thread_ts: slackThreadId,
        text: `Let's continue the discussion here: ${roomURL}`,
      });
    } catch (error) {
      if (isChannelNotFoundError(error)) {
        const slackInstallURL =
          team && teamMember
            ? await getSlackInstallURL({ withBot: false }, { teamId: team.id, userId: teamMember.user_id })
            : null;
        await ack({
          response_action: "push",
          view: {
            type: "modal",
            title: { type: "plain_text", text: "Acapela successfully created!" },
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: [
                    `Click <${roomURL}|here to view your Acapela room>.`,
                    ...(slackInstallURL
                      ? `We can automatically post the room link next time, if you <${slackInstallURL}|connect Acapela with Slack>. `
                      : "There was no Acapela user found for your Slack email address. Create one and we can post room links for you next time."),
                  ].join("\n"),
                },
              },
            ],
          },
        });
      } else {
        throw error;
      }
    }
  });

  slackApp.action("select_space", ({ ack }) => ack());
  slackApp.action("members_select", ({ ack }) => ack());

  slackApp.shortcut(ACAPELA_MESSAGE, async ({ shortcut, ack, client }) => {
    await ack();

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
          slackChannelId: shortcut.channel.id,
          slackThreadId: shortcut.message_ts,
        }),
      },
    });
  });
}
