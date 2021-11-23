import { sendInviteNotification } from "~backend/src/inviteUser";
import { Account, User, db } from "~db";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { assertDefined } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { MENTION_TYPE_KEY, getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { slugify } from "~shared/slugify";
import { DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH, truncateTextWithEllipsis } from "~shared/text/ellipsis";
import { Maybe } from "~shared/types";
import { EditorMentionData } from "~shared/types/editor";
import { MentionType, REQUEST_TYPES, RequestType } from "~shared/types/mention";

import { slackClient } from "../app";
import { updateHomeView } from "../home-tab";
import { parseAndTransformToTipTapJSON } from "../md/parser";
import { fetchTeamBotToken, findUserBySlackId } from "../utils";

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
        const user = await transaction.user.upsert({
          where: { email },
          create: { name, email, avatar_url: profile?.image_original, current_team_id: teamId },
          update: {},
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
  const [team, invitingUser] = await Promise.all([
    db.team.findUnique({ where: { id: teamId } }),
    db.user.findUnique({ where: { id: invitingUserId } }),
  ]);
  if (team && invitingUser) {
    await Promise.all(usersWithSlackIds.map(({ user }) => sendInviteNotification(user, team, invitingUser, false)));
  }

  for (const invitedUser of usersWithSlackIds) {
    trackBackendUserEvent(invitingUserId, "Invite Sent", { email: invitedUser.user.email, teamId, origin: "slack" });
  }

  return usersWithSlackIds.map(({ slackUserId, user }) => ({ slackUserId, userId: user.id }));
}

type UserWithMaybeMentionType = { userId: string; mentionType?: MentionType; slackUserId: string };

type SlackUserIdWithRequestType = { slackUserId: string; mentionType?: MentionType };

export async function findOrInviteUsers({
  slackToken,
  teamId,
  invitingUserId,
  slackUserIdsWithMentionType,
}: {
  slackToken: string;
  teamId: string;
  invitingUserId: string;
  slackUserIdsWithMentionType: SlackUserIdWithRequestType[];
}): Promise<UserWithMaybeMentionType[]> {
  const usersForSlackIds = await Promise.all(
    slackUserIdsWithMentionType.map(async ({ slackUserId, mentionType }) => ({
      slackUserId,
      mentionType: mentionType,
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
          mentionType: item.mentionType,
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
        mentionType: slackUserIdsWithMentionType.find((item) => item.slackUserId == row.slackUserId)!.mentionType,
        slackUserId: row.slackUserId,
      } as const)
  );
  return [...userIds, ...newUserIds];
}

function transformMessage(
  rawMessage: string,
  slackTeamId: string,
  usersWithRequestType: (UserWithMaybeMentionType & { mentionType: MentionType })[]
) {
  const mentionedUsersBySlackId = Object.fromEntries(
    usersWithRequestType.map((u) => [
      u.slackUserId,
      {
        type: u.mentionType,
        userId: u.userId,
      },
    ])
  );

  const messageContent = parseAndTransformToTipTapJSON(rawMessage, {
    slackTeamId,
    mentionedUsersBySlackId,
  });
  const alreadyMentionedUsers = new Set(
    getUniqueRequestMentionDataFromContent(messageContent)
      .filter((d) => "userId" in d)
      .map((mentionData) => mentionData.userId)
  );
  const extraMentionNodes = usersWithRequestType
    .filter(({ userId }) => !alreadyMentionedUsers.has(userId))
    .flatMap(({ userId, mentionType }) => {
      const data: EditorMentionData = { userId, type: mentionType };
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
  ownerSlackUserId,
  slackTeamId,
  topicName,
  rawTopicMessage,
  slackUserIdsWithMentionType,
}: {
  token: string;
  teamId: string;
  ownerId: string;
  ownerSlackUserId: string;
  slackTeamId: string;
  topicName: Maybe<string>;
  rawTopicMessage: string;
  slackUserIdsWithMentionType: SlackUserIdWithRequestType[];
}) {
  const usersWithMentionType = await findOrInviteUsers({
    slackToken: token,
    teamId,
    invitingUserId: ownerId,
    slackUserIdsWithMentionType,
  });

  const messageContent = transformMessage(
    rawTopicMessage,
    slackTeamId,
    usersWithMentionType.filter((u) => u.mentionType) as never
  );
  const messageContentText = convertMessageContentToPlainText(messageContent);
  const userIds = new Set(usersWithMentionType.map(({ userId }) => userId).concat(ownerId));
  topicName = topicName || truncateTextWithEllipsis(messageContentText, DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH);
  const topic = await db.topic.create({
    data: {
      team_id: teamId,
      name: topicName,
      slug: await slugify(topicName),
      index: "a",
      owner_id: ownerId,
      topic_member: { createMany: { data: Array.from(userIds).map((user_id) => ({ user_id })) } },
      message: {
        create: {
          type: "TEXT",
          user_id: ownerId,
          content: messageContent,
          content_text: messageContentText,
          task: {
            createMany: {
              data: usersWithMentionType
                .filter((item) => REQUEST_TYPES.includes(item.mentionType as RequestType))
                .map((item) => ({
                  type: item.mentionType,
                  user_id: item.userId,
                })),
            },
          },
        },
      },
    },
    include: { message: true },
  });

  const botToken = assertDefined(await fetchTeamBotToken(teamId), "must have bot token");
  await updateHomeView(botToken, ownerSlackUserId);

  return topic;
}
