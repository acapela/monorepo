import { Octokit } from "octokit";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { GithubAccountToInstallation, db } from "@aca/db";

async function createOnboardingNotifications(userId: string) {
  const account = (await db.github_account.findUnique({ where: { user_id: userId } }))!;
  const authToken = account.oauth_token;
  if (!authToken) {
    return;
  }

  const octokit = new Octokit({ auth: authToken });
  const { data: notifications } = await octokit.request("GET /notifications");
  for (const notification of notifications) {
    const { reason, subject } = notification;
    const generalFields = {
      title: subject.title,
      repository_id: notification.repository.id,
      repository_full_name: notification.repository.full_name,
    };
    const userFields = { user_id: account.user_id, created_at: notification.updated_at };

    switch (reason) {
      case "mention": {
        const { data: commentOrIssue } = await octokit.request(subject.latest_comment_url);
        let issueId;
        if (commentOrIssue.issue_url) {
          const { data: issue } = await octokit.request(commentOrIssue.issue_url);
          issueId = issue.id;
        } else {
          issueId = commentOrIssue.id;
        }
        await db.notification_github.create({
          data: {
            notification: {
              create: {
                url: commentOrIssue.html_url,
                from: commentOrIssue.user.login,
                ...userFields,
              },
            },
            type: "mention",
            issue_id: issueId,
            ...generalFields,
          },
        });
        break;
      }
      case "assign": {
        const { data: issueOrPR } = await octokit.request(subject.url);
        const isIssue = Buffer.from(issueOrPR.node_id, "base64").toString().split(":")[1].startsWith("Issue");
        await db.notification_github.create({
          data: {
            notification: {
              create: {
                url: issueOrPR.html_url,
                from: issueOrPR.user.login,
                ...userFields,
              },
            },
            type: "assign",
            issue_id: isIssue ? issueOrPR.id : null,
            pr_id: !isIssue ? issueOrPR.id : null,
            ...generalFields,
          },
        });
        break;
      }
      case "review_requested": {
        const { data: pr } = await octokit.request(subject.url);
        await db.notification_github.create({
          data: {
            notification: {
              create: {
                url: pr.html_url,
                from: pr.user.login,
                ...userFields,
              },
            },
            type: "review",
            pr_id: pr.id,
            ...generalFields,
          },
        });
        break;
      }
    }
  }
}

export async function handleGithubAccountToInstallationChanges(event: HasuraEvent<GithubAccountToInstallation>) {
  if (event.type !== "create") {
    return;
  }
  await createOnboardingNotifications(event.item.user_id);
}
