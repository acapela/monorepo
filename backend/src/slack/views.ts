import * as SlackBolt from "@slack/bolt";
import { ActionsBlock, GlobalShortcut, InputBlock, MessageShortcut, SlackShortcut, View } from "@slack/bolt";

import { getSlackInstallURL } from "~backend/src/slack/install";
import { db } from "~db";
import { WebClient } from "~node_modules/@slack/web-api";
import { assertDefined } from "~shared/assert";
import { isNotNullish } from "~shared/nullish";

const createPlainMessageContent = (text: string) => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text }] }],
});

const createRoomWithTopic = async ({
  spaceId,
  roomName,
  creatorId,
  userIds,
  topicName,
  topicMessage,
}: {
  spaceId: string;
  roomName: string;
  creatorId: string;
  userIds: string[];
  topicName: string;
  topicMessage: string;
}) => {
  const room = await db.room.create({
    data: {
      name: roomName,
      slug: roomName,
      creator_id: creatorId,
      owner_id: creatorId,
      space_id: spaceId,
      room_member: { createMany: { data: userIds.map((user_id) => ({ user_id })) } },
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
  return [room, topic];
};

async function getUsersByEmail(client: WebClient, roomMembers: string[], email: string) {
  const memberProfiles = await Promise.all(roomMembers.map((memberId) => client.users.profile.get({ user: memberId })));
  return db.user.findMany({
    where: {
      email: {
        in: memberProfiles
          .map((response) => response.profile?.email)
          .filter(isNotNullish)
          .concat(email),
      },
    },
  });
}

const createSuccessModal = ({
  roomURL,
  hasUserToken,
  slackInstallURL,
  shortcut,
}: {
  roomURL: string;
  hasUserToken: boolean;
  slackInstallURL: string | null;
  shortcut: GlobalShortcut | MessageShortcut;
}): View => ({
  type: "modal",
  callback_id: "send_message_modal",
  title: {
    type: "plain_text",
    text: "Success!",
  },
  close: {
    type: "plain_text",
    text: "Close",
  },
  submit: hasUserToken ? { type: "plain_text", text: "Send Message" } : undefined,
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Your Acapela is waiting for you ${roomURL}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: hasUserToken
          ? "Let others know about it:"
          : slackInstallURL
          ? `We can post the room link for you next time, if you <${slackInstallURL}|connect Acapela with Slack>.`
          : "",
      },
    },
    ...(hasUserToken
      ? [
          {
            type: "input",
            block_id: "message_block",
            label: {
              type: "plain_text",
              text: "Message",
            },
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "message",
              initial_value: `Let's continue the discussion in Acapela: ${roomURL}`,
            },
          } as InputBlock,
          ...(shortcut.type == "shortcut"
            ? [
                {
                  type: "actions",
                  block_id: "conversation_block",
                  elements: [
                    {
                      type: "conversations_select",
                      action_id: "conversation_id",
                      placeholder: {
                        type: "plain_text",
                        text: "Select a conversation",
                      },
                      default_to_current_conversation: true,
                    },
                  ],
                } as ActionsBlock,
              ]
            : []),
        ]
      : []),
  ],
  private_metadata: JSON.stringify(shortcut),
});

export function setupSlackViews(slackApp: SlackBolt.App) {
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

    if (!(spaceId && roomName && topicName && topicMessage && roomMembers)) {
      return ack({
        response_action: "errors",
        errors: {
          room_block: "Sorry, this isn’t valid input",
        },
      });
    }

    const [team, profileResponse] = await Promise.all([
      db.team.findFirst({ where: { team_slack_installation: { slack_team_id: body.user.team_id } } }),
      client.users.profile.get({ user: body.user.id }),
    ]);
    const email = assertDefined(profileResponse.profile?.email, "current user must have profile and email");

    const users = await getUsersByEmail(client, roomMembers, email);
    const user = users.find((u) => u.email == email);

    const creatorId = assertDefined(user?.id ?? team?.owner_id, "needs to at least have a team");
    const [room, topic] = await createRoomWithTopic({
      spaceId,
      roomName,
      creatorId,
      userIds: users.map((u) => u.id),
      topicName,
      topicMessage,
    });

    if (!room || !topic) {
      return await ack({
        response_action: "errors",
        errors: {
          email_address: "Room creation failed",
        },
      });
    }

    const roomURL = `${process.env.FRONTEND_URL}/space/${spaceId}/${room.id}/${topic.id}`;

    const shortcut = JSON.parse(view.private_metadata) as SlackShortcut;

    const hasUserToken = Boolean(context.userToken);
    await client.views.update({
      response_action: "update",
      view_id: body.view.id,
      view: createSuccessModal({
        roomURL,
        hasUserToken,
        slackInstallURL:
          team && user
            ? (await getSlackInstallURL(
                { withBot: false },
                {
                  teamId: team.id,
                  userId: user.id,
                }
              )) ?? null
            : null,
        shortcut,
      }),
    });
    await ack({ response_action: "errors", errors: {} });
  });

  slackApp.view("send_message_modal", async ({ ack, view, client, context }) => {
    await ack();
    const viewValues = view.state.values;
    const message = assertDefined(viewValues.message_block.message.value, "should get a message");
    const shortcut = JSON.parse(view.private_metadata) as SlackShortcut;
    const isMessageAction = shortcut.type == "message_action";
    const channelId = assertDefined(
      isMessageAction ? shortcut.channel.id : viewValues.conversation_block.conversation_id.selected_conversation,
      "should get a channel ID"
    );
    await client.chat.postMessage({
      token: context.userToken,
      channel: channelId,
      thread_ts: isMessageAction ? shortcut.message_ts : undefined,
      text: message,
    });
  });
}
