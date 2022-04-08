import { Octokit } from "octokit";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { GithubAccountToInstallation, db } from "@aca/db";

type Subject = { latest_comment_url: string; url: string };

async function extractMention(octokit: Octokit, subject: Subject) {
  const { data: commentOrIssue } = await octokit.request(subject.latest_comment_url);
  let issueId;
  if (commentOrIssue.issue_url) {
    const { data: issue } = await octokit.request(commentOrIssue.issue_url);
    issueId = issue.id;
  } else {
    issueId = commentOrIssue.id;
  }
  return {
    notification: { url: commentOrIssue.html_url, from: commentOrIssue.user.login },
    type: "mention",
    issue_id: issueId,
  };
}

async function extractAssign(octokit: Octokit, subject: Subject) {
  const { data: issueOrPR } = await octokit.request(subject.url);
  const isIssue = Buffer.from(issueOrPR.node_id, "base64").toString().split(":")[1].startsWith("Issue");
  return {
    notification: { url: issueOrPR.html_url, from: issueOrPR.user.login },
    type: "assign",
    issue_id: isIssue ? issueOrPR.id : null,
    pr_id: !isIssue ? issueOrPR.id : null,
  };
}

async function extractReviewRequest(octokit: Octokit, subject: Subject) {
  const { data: pr } = await octokit.request(subject.url);
  return { notification: { url: pr.html_url, from: pr.user.login }, type: "review", pr_id: pr.id };
}

function extract(octokit: Octokit, { reason, subject }: { reason: string; subject: Subject }) {
  switch (reason) {
    case "mention":
      return extractMention(octokit, subject);

    case "assign":
      return extractAssign(octokit, subject);

    case "review_requested": {
      return extractReviewRequest(octokit, subject);
    }
  }
}

async function createOnboardingNotifications(userId: string) {
  const account = (await db.github_account.findUnique({ where: { user_id: userId } }))!;
  const authToken = account.oauth_token;
  if (!authToken) {
    return;
  }

  const octokit = new Octokit({ auth: authToken });
  const { data: notifications } = await octokit.request("GET /notifications");
  for (const notification of notifications) {
    const fields = await extract(octokit, notification);
    if (!fields) {
      continue;
    }

    const { notification: notificationFields, ...notificationGithubFields } = fields;

    await db.notification_github.upsert({
      where: { github_notification_id: notification.id },
      create: {
        github_notification_id: notification.id,
        notification: {
          create: { user_id: account.user_id, created_at: notification.updated_at, ...notificationFields },
        },
        title: notification.subject.title,
        repository_id: notification.repository.id,
        repository_full_name: notification.repository.full_name,
        ...notificationGithubFields,
      },
      update: {},
    });
  }
}

export async function handleGithubAccountToInstallationChanges(event: HasuraEvent<GithubAccountToInstallation>) {
  if (event.type !== "create") {
    return;
  }
  await createOnboardingNotifications(event.item.user_id);
}
