import { db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";

import { JiraWebhookPayload } from "../types";
import { handleJiraIssueUpdate } from "./captureIssueUpdates";
import {
  EXTRACT_MENTIONED_ACCOUNT_REGEX,
  extractMentionedAccountIds,
  getLeastRecentlyUsedAtlassianAccount,
  getWatchers,
} from "./utils";

export async function captureJiraWebhook(payload: JiraWebhookPayload) {
  try {
    if (payload.webhookEvent === "comment_created") {
      await handleNewJiraComment(payload);
    }
    if (payload.webhookEvent === "jira:issue_updated") {
      await handleJiraIssueUpdate(payload);
    }
    if (payload.webhookEvent === "jira:issue_created") {
      await handleJiraIssueCreated(payload);
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { response } = error as any;
    logger.error(
      error,
      `Error while handling Jira webhook for event ${payload.webhookEvent}` + response
        ? ` with status ${response.status} and body ${response.data}`
        : ""
    );
  }
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

  let from: string;

  try {
    from = payload.comment.author.displayName;
  } catch (e) {
    logger.error("Unable to get author display name", JSON.stringify(payload, null, 2));
    from = "Unknown";
  }

  const notificationsSend = mentionedUsersToNotify
    .concat(watchersToNotify)
    .map(({ user, notification_jira_issue_type_value }) =>
      db.notification_jira_issue.create({
        data: {
          notification: {
            create: {
              user_id: user.id,
              url: commentUrl,
              from,
              // TODO: make another api call to get the display names of all the mentioned users
              text_preview: payload.comment?.body?.replaceAll(EXTRACT_MENTIONED_ACCOUNT_REGEX, "@..."),
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

async function handleJiraIssueCreated(payload: JiraWebhookPayload) {
  const accountThatCreatedIssue = payload.user;

  //e.g. https://acapela-team.atlassian.net
  const baseSitePath = payload.issue.self.split("/rest")[0];
  const issueUrl = `${baseSitePath}/browse/${payload.issue.key}`;

  // There can be multiple updates in one same webhook.
  // We want to notify individual users only about one update found in the webhook
  // This array keeps a record of people that were already notified
  const notifiedUsers: string[] = [];

  const assignedAccount = payload.issue.fields.assignee;

  // Notifies user that had this ticket assigned
  if (assignedAccount && assignedAccount.accountId !== accountThatCreatedIssue?.accountId) {
    const userToNotify = await db.user.findFirst({
      where: {
        account: {
          some: {
            AND: [{ provider_id: "atlassian" }, { provider_account_id: { equals: assignedAccount.accountId } }],
          },
        },
      },
    });

    if (userToNotify) {
      await db.notification_jira_issue.create({
        data: {
          notification: {
            create: {
              user_id: userToNotify.id,
              url: issueUrl,
              from: accountThatCreatedIssue?.displayName ?? "Jira",
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
      notifiedUsers.push(userToNotify.id);
    }
  }

  const atlassianAccountsMentioned = extractMentionedAccountIds(payload.issue.fields.description).filter(
    (mention) => mention !== accountThatCreatedIssue?.accountId && mention !== assignedAccount?.accountId
  );

  // Notify users that were mentioned in the description
  if (atlassianAccountsMentioned.length > 0) {
    const mentionedUsersToNotify = await db.user.findMany({
      where: {
        account: {
          some: {
            AND: [{ provider_id: "atlassian" }, { provider_account_id: { in: atlassianAccountsMentioned } }],
          },
        },
      },
    });

    const notificationsSend = mentionedUsersToNotify.map((user) =>
      db.notification_jira_issue.create({
        data: {
          notification: {
            create: {
              user_id: user.id,
              url: issueUrl,
              from: accountThatCreatedIssue?.displayName ?? "Jira",
              // TODO: make another api call to get the display names of all the mentioned users
              text_preview: payload.issue.fields.description?.replaceAll(EXTRACT_MENTIONED_ACCOUNT_REGEX, "@..."),
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

    return await Promise.all(notificationsSend);
  }
}
