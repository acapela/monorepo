import { sendInviteNotification } from "~backend/src/inviteUser";
import { slackClient } from "~backend/src/slack/app";
import { parseAndTransformToTipTapJSON } from "~backend/src/slack/slackMarkdown/parser";
import { findUserBySlackId } from "~backend/src/slack/utils";
import { Account, User, db } from "~db";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { MENTION_TYPE_KEY, getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { slugify } from "~shared/slugify";
import { EditorMentionData } from "~shared/types/editor";
import { MentionType } from "~shared/types/mention";

async function createAndInviteMissingUsers(
  slackToken: string,
  teamId: string,
  invitingUserId: string,
  slackUserIds: string[]
) {
  const usersWithSlackIds: { slackUserId: string; user: User & { account: Account[] } }[] = [];
  await db.$transaction(async (transactionUntyped) => {
    const transaction = transactionUntyped as typeof db;
    await Promise.all(
      slackUserIds.map(async (slackUserId) => {
        const { profile } = await slackClient.users.profile.get({
          token: slackToken,
          user: slackUserId,
        });
        const name = profile?.real_name;
        const email = profile?.email;
        if (!name || !email) {
          return;
        }
        const user = await transaction.user.create({
          data: { name, email, avatar_url: profile?.image_original },
          include: { account: true },
        });
        await transaction.team_member.create({
          data: {
            team_id: teamId,
            user_id: user.id,
            team_member_slack: { create: { slack_user_id: slackUserId } },
          },
        });
        usersWithSlackIds.push({ slackUserId, user });
      })
    );
  });

  await Promise.all(usersWithSlackIds.map(({ user }) => sendInviteNotification(user, teamId, invitingUserId)));

  return usersWithSlackIds.map(({ slackUserId, user }) => ({ slackUserId, userId: user.id }));
}

type UserWithRequest = { userId: string; requestType: MentionType; slackUserId: string };

type SlackUserIdWithRequestType = { slackUserId: string; requestType: MentionType };

export async function findOrInviteUsers({
  slackToken,
  teamId,
  invitingUserId,
  slackUserIdsWithRequestType,
}: {
  slackToken: string;
  teamId: string;
  invitingUserId: string;
  slackUserIdsWithRequestType: SlackUserIdWithRequestType[];
}): Promise<UserWithRequest[]> {
  const usersForSlackIds = await Promise.all(
    slackUserIdsWithRequestType.map(async ({ slackUserId, requestType }) => ({
      slackUserId,
      requestType,
      user: await findUserBySlackId(slackToken, slackUserId, teamId),
    }))
  );
  const userIds = usersForSlackIds
    .filter((item) => item.user)
    .map(
      (item) =>
        ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userId: item.user!.id,
          requestType: item.requestType,
          slackUserId: item.slackUserId,
        } as const)
    );

  const missingUsersSlackIds = usersForSlackIds.filter((item) => !item.user).map((item) => item.slackUserId);

  if (missingUsersSlackIds.length === 0) {
    return userIds;
  }

  const newUsers = await createAndInviteMissingUsers(slackToken, teamId, invitingUserId, missingUsersSlackIds);
  const newUserIds = newUsers.map(
    (row) =>
      ({
        userId: row.userId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        requestType: slackUserIdsWithRequestType.find((item) => item.slackUserId == row.slackUserId)!.requestType,
        slackUserId: row.slackUserId,
      } as const)
  );
  return [...userIds, ...newUserIds];
}

function transformMessage(rawMessage: string, slackTeamId: string, usersWithRequestType: UserWithRequest[]) {
  const mentionedUsersBySlackId = Object.fromEntries(
    usersWithRequestType.map((u) => [
      u.slackUserId,
      {
        type: u.requestType,
        userId: u.userId,
      },
    ])
  );

  const messageContent = parseAndTransformToTipTapJSON(rawMessage, {
    slackTeamId,
    mentionedUsersBySlackId,
  });
  const alreadyMentionedUsers = new Set(
    getUniqueRequestMentionDataFromContent(messageContent).map((mentionData) => mentionData.userId)
  );
  const extraMentionNodes = usersWithRequestType
    .filter(({ userId }) => !alreadyMentionedUsers.has(userId))
    .flatMap(({ userId, requestType }) => {
      const data: EditorMentionData = { userId, type: requestType };
      return [
        { type: MENTION_TYPE_KEY, attrs: { data } },
        { type: "text", text: " " },
      ];
    });
  if (extraMentionNodes.length) {
    messageContent.content.push(
      {
        type: "paragraph",
        content: [],
      },
      {
        type: "paragraph",
        content: extraMentionNodes,
      }
    );
  }
  return messageContent;
}

export async function createTopicForSlackUsers({
  token,
  teamId,
  ownerId,
  slackTeamId,
  topicName,
  rawTopicMessage,
  slackUserIdsWithRequestType,
}: {
  token: string;
  teamId: string;
  ownerId: string;
  slackTeamId: string;
  topicName: string;
  rawTopicMessage: string;
  slackUserIdsWithRequestType: SlackUserIdWithRequestType[];
}) {
  const usersWithRequestType = await findOrInviteUsers({
    slackToken: token,
    teamId,
    invitingUserId: ownerId,
    slackUserIdsWithRequestType,
  });

  const messageContent = transformMessage(rawTopicMessage, slackTeamId, usersWithRequestType);
  const messageContentText = convertMessageContentToPlainText(messageContent);
  return await db.topic.create({
    data: {
      team_id: teamId,
      name: topicName,
      slug: await slugify(topicName),
      index: "a",
      owner_id: ownerId,
      message: {
        create: {
          type: "TEXT",
          user_id: ownerId,
          content: messageContent,
          content_text: messageContentText,
          task: {
            createMany: {
              data: usersWithRequestType.map((item) => ({
                type: item.requestType,
                user_id: item.userId,
              })),
            },
          },
        },
      },
    },
  });
}
