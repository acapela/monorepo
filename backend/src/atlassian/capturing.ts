import { db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";

import { getIssueWatchers, jiraRequest } from "./rest";
import { GetWatchersResponse, JiraAccountWithAllDetails, JiraWebhookPayload } from "./types";

const EXTRACT_MENTIONED_ACCOUNT_REGEX = /\[~accountid:([a-zA-Z0-9\-:]+)\]/gim;

export async function captureJiraWebhook(payload: JiraWebhookPayload) {
  if (payload.webhookEvent === "comment_created") {
    await handleNewJiraComment(payload);
  }
  if (payload.webhookEvent === "jira:issue_updated") {
    await handleJiraIssueUpdate(payload);
  }
}

function extractMentionedAccountIds(text: string) {
  const result = [];

  for (const match of text.matchAll(EXTRACT_MENTIONED_ACCOUNT_REGEX)) {
    // match[0] = "[~accountid:70121:cb8ddaa4-9bec-41fa-843f-34675d008b41]"
    // match[1] = "70121:cb8ddaa4-9bec-41fa-843f-34675d008b41"
    if (match[1]) {
      result.push(match[1]);
    }
  }
  return result;
}
/*
  Possible new notification_jira_issue_type: "user_mentioned","comment_created" 
*/
async function handleNewJiraComment(payload: JiraWebhookPayload) {
  assert(payload.comment, "A comment must be included for jira comment webhooks");

  //e.g. https://acapela-team.atlassian.net
  const baseSitePath = payload.issue.self.split("/rest")[0];
  const commentUrl = `${baseSitePath}/browse/${payload.issue.key}?focusedCommentId=${payload.comment.id}`;

  const commentAuthorId = payload.comment.author.accountId;

  const isNotCommentAuthor = (atlassianAccountId: string) => atlassianAccountId !== commentAuthorId;

  // We're attempting to do a round-robin of access_token usage based on "least recently used access token"
  // The point is that we would like to distribute api rate limit "cost" of making an api call between
  // all users of the same jira cloud is. This way, we don't overexpose a single users' access_token
  // where it could reach rate limits really fast
  const jiraAccount = await getLeastRecentlyUsedAtlassianAccount(baseSitePath);
  const atlassianAccountsMentioned = extractMentionedAccountIds(payload.comment?.body ?? "").filter(isNotCommentAuthor);

  // Mention notifications are more important than watcher notifications
  // We're excluding mentions from watcher to prevent double notifications
  const watchersThatAreNotMentioned = (await getWatchers(jiraAccount, payload.issue.key)).filter(
    (watcherAccountId) => !atlassianAccountsMentioned.includes(watcherAccountId) && isNotCommentAuthor(watcherAccountId)
  );

  const watchersToNotify = (
    await db.user.findMany({
      where: {
        account: {
          some: {
            AND: [{ provider_id: "atlassian" }, { provider_account_id: { in: watchersThatAreNotMentioned } }],
          },
        },
      },
    })
  ).map((user) => ({
    user,
    notification_jira_issue_type_value: "comment_created",
  }));

  const mentionedUsersToNotify = (
    await db.user.findMany({
      where: {
        account: {
          some: {
            AND: [{ provider_id: "atlassian" }, { provider_account_id: { in: atlassianAccountsMentioned } }],
          },
        },
      },
    })
  ).map((user) => ({
    user,
    notification_jira_issue_type_value: "user_mentioned",
  }));

  const notificationsSend = mentionedUsersToNotify
    .concat(watchersToNotify)
    .map(({ user, notification_jira_issue_type_value }) =>
      db.notification_jira_issue.create({
        data: {
          notification: {
            create: {
              user_id: user.id,
              url: commentUrl,
              from: payload.comment?.author.displayName ?? "",
              // TODO: make another api call to get the display names of all the mentioned users
              text_preview: payload.comment?.body.replaceAll(EXTRACT_MENTIONED_ACCOUNT_REGEX, "@..."),
            },
          },
          issue_id: payload.issue.id,
          issue_title: payload.issue.fields.summary,
          notification_jira_issue_type: {
            connect: {
              value: notification_jira_issue_type_value,
            },
          },
        },
      })
    );

  return await Promise.all(notificationsSend);
}

async function handleJiraIssueUpdate(payload: JiraWebhookPayload) {
  const userThatUpdatedIssue = payload.user;

  //e.g. https://acapela-team.atlassian.net
  const baseSitePath = payload.issue.self.split("/rest")[0];
  const issueUrl = `${baseSitePath}/browse/${payload.issue.key}`;

  // There can be multiple updates in one same webhook.
  // We want to notify individual users only about one update found in the webhook
  // This array keeps a record of people that were already notified
  const notifiedUsers: string[] = [];

  for (const changeLogItem of payload.changelog.items) {
    // Creates `user_mentioned` notifications for users that were mentioned in the description
    if (changeLogItem.fieldId === "description") {
      const mentionsBeforeUpdate = extractMentionedAccountIds(changeLogItem.fromString ?? "");
      const mentionsAfterUpdate = extractMentionedAccountIds(changeLogItem.toString ?? "");

      // Mentions that are not added in between issue updates should not create a new notification
      const newAccountsMentioned = mentionsAfterUpdate.filter(
        (mentionedAccountId) =>
          !mentionsBeforeUpdate.includes(mentionedAccountId) && mentionedAccountId !== userThatUpdatedIssue.accountId
      );

      if (newAccountsMentioned.length === 0) {
        continue;
      }

      const mentionedUsersToNotify = (
        await db.user.findMany({
          where: {
            account: {
              some: {
                AND: [{ provider_id: "atlassian" }, { provider_account_id: { in: newAccountsMentioned } }],
              },
            },
          },
        })
      ).filter((user) => !notifiedUsers.includes(user.id));

      mentionedUsersToNotify.forEach(
        async (user) =>
          await db.notification_jira_issue.create({
            data: {
              notification: {
                create: {
                  user_id: user.id,
                  url: issueUrl,
                  from: payload.user.displayName ?? "",
                  // TODO: make another api call to get the display names of all the mentioned users
                  text_preview: payload.issue.fields.description.replaceAll(EXTRACT_MENTIONED_ACCOUNT_REGEX, "@..."),
                },
              },
              issue_id: payload.issue.id,
              issue_title: payload.issue.fields.summary,
              notification_jira_issue_type: {
                connect: {
                  value: "user_mentioned",
                },
              },
            },
          })
      );

      notifiedUsers.push(...mentionedUsersToNotify.map(({ id }) => id));
    }

    // Creates `user_assigned` notifications for users that were assigned to an issue
    if (changeLogItem.fieldId === "assignee") {
      const assignedAccountId = changeLogItem.to;
      if (!assignedAccountId || assignedAccountId === userThatUpdatedIssue.accountId) {
        continue;
      }

      const assigneeToNotify = await db.user.findFirst({
        where: {
          account: {
            some: {
              AND: [{ provider_id: "atlassian" }, { provider_account_id: { equals: assignedAccountId } }],
            },
          },
        },
      });

      if (!assigneeToNotify || notifiedUsers.includes(assigneeToNotify.id)) {
        continue;
      }

      await db.notification_jira_issue.create({
        data: {
          notification: {
            create: {
              user_id: assigneeToNotify.id,
              url: issueUrl,
              from: payload.user.displayName ?? "",
            },
          },
          issue_id: payload.issue.id,
          issue_title: payload.issue.fields.summary,
          notification_jira_issue_type: {
            connect: {
              value: "issue_assigned",
            },
          },
        },
      });

      notifiedUsers.push(assigneeToNotify.id);
    }

    // Notifies all issue watchers when the status of the issue was updated
    if (payload.changelog.items.some(({ fieldId }) => fieldId === "status")) {
      // We're attempting to do a round-robin of access_token usage based on "least recently used access token"
      // The point is that we would like to distribute api rate limit "cost" of making an api call between
      // all users of the same jira cloud is. This way, we don't overexpose a single users' access_token
      // where it could reach rate limits really fast
      const jiraAccount = await getLeastRecentlyUsedAtlassianAccount(baseSitePath);

      // Mention notifications are more important than watcher notifications
      // We're excluding mentions from watcher to prevent double notifications
      const watchersExceptUserThatUpdatedIssue = (await getWatchers(jiraAccount, payload.issue.key)).filter(
        (watcherAccountId) => watcherAccountId !== userThatUpdatedIssue.accountId
      );

      const watchersToNotify = (
        await db.user.findMany({
          where: {
            account: {
              some: {
                AND: [
                  { provider_id: "atlassian" },
                  { provider_account_id: { in: watchersExceptUserThatUpdatedIssue } },
                ],
              },
            },
          },
        })
      ).filter((u) => !notifiedUsers.includes(u.id));

      watchersToNotify.map(
        async (user) =>
          await db.notification_jira_issue.create({
            data: {
              notification: {
                create: {
                  user_id: user.id,
                  url: issueUrl,
                  from: payload.user.displayName ?? "",
                },
              },
              from: changeLogItem.fromString,
              to: changeLogItem.toString,
              issue_id: payload.issue.id,
              issue_title: payload.issue.fields.summary,
              notification_jira_issue_type: {
                connect: {
                  value: "issue_status_updated",
                },
              },
            },
          })
      );

      notifiedUsers.push(...watchersToNotify.map(({ id }) => id));
    }
  }
}

async function getWatchers(jiraAccount: JiraAccountWithAllDetails, issueKey: string) {
  const response = await jiraRequest(jiraAccount, getIssueWatchers(issueKey));

  if (!response) {
    return [];
  }

  const watchers = response.data as GetWatchersResponse;

  return watchers.watchers.map((w) => w.accountId);
}

async function getLeastRecentlyUsedAtlassianAccount(atlassianCloudUrl: string): Promise<JiraAccountWithAllDetails> {
  const jiraAccount = await db.jira_account.findFirst({
    where: {
      atlassian_site: {
        url: atlassianCloudUrl,
      },
    },
    orderBy: {
      rest_req_last_used_at: "asc",
    },
    include: {
      account: true,
      atlassian_site: true,
    },
  });

  assert(jiraAccount, "jira account not found for atlassianCloudUrl " + atlassianCloudUrl, logger.error.bind(logger));

  return jiraAccount;
}
