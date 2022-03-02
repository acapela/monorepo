import { JiraAccount, db } from "@aca/db";
import { assert } from "@aca/shared/assert";

import { getIssueWatchers, jiraRequest } from "./rest";
import { GetWatchersResponse, JiraWebhookPayload } from "./types";

const EXTRACT_MENTIONED_ACCOUNT_REGEX = /\[~accountid:([a-zA-Z0-9\-:]+)\]/gim;

export async function captureJiraWebhook(payload: JiraWebhookPayload) {
  if (payload.webhookEvent === "comment_created") {
    await handleNewJiraComment(payload);
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
  //e.g. https://acapela-team.atlassian.net
  const baseSitePath = payload.issue.self.split("/rest")[0];
  const commentUrl = `${baseSitePath}/browse/${payload.issue.key}?focusedCommentId=${payload.comment?.id}`;

  // We're attempting to do a round-robin of access_token usage based on "least recently used access token"
  // The point is that we would like to distribute api rate limit "cost" of making an api call between
  // all users of the same jira cloud is. This way, we don't overexpose a single users' access_token
  // where it could reach rate limits really fast
  const jiraAccount = await getLeastRecentlyUsedAtlassianAccount(payload.matchedWebhookIds[0]);
  const atlassianAccountsMentioned = extractMentionedAccountIds(payload.comment?.body ?? "");

  // Mention notifications are more important than watcher notifications
  // We're excluding mentions from watcher to prevent double notifications
  const watchersThatAreNotMentioned = (await getWatchers(jiraAccount, payload.issue.key)).filter(
    (watcherAccountId) => !atlassianAccountsMentioned.includes(watcherAccountId)
  );

  console.info("Atlassian account watchers", watchersThatAreNotMentioned);

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

async function getWatchers(jiraAccount: JiraAccount, issueKey: string) {
  const response = await jiraRequest(jiraAccount, getIssueWatchers(issueKey));

  if (!response) {
    return [];
  }

  const watchers = response.data as GetWatchersResponse;

  return watchers.watchers.map((w) => w.accountId);
}

async function getLeastRecentlyUsedAtlassianAccount(webhookId: number): Promise<JiraAccount> {
  const jiraAccount = await db.jira_account.findFirst({
    where: {
      jira_webhook: {
        some: {
          jira_webhook_id: webhookId,
        },
      },
    },
    orderBy: {
      rest_req_last_used_at: "asc",
    },
  });

  assert(jiraAccount, "jira account not found for webhook " + webhookId);

  return jiraAccount;
}
