import { EmitterWebhookEvent, Webhooks } from "@octokit/webhooks";
import { Team, User } from "@octokit/webhooks-types";
import * as Sentry from "@sentry/node";

import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

export function addWebhookHandlers(webhooks: Webhooks) {
  webhooks.on("installation.deleted", installationDeleted);
  webhooks.on("installation.created", installationCreated);

  webhooks.on("issue_comment.created", commentCreated);
  webhooks.on("issues.assigned", issueOrPrAssigned);

  webhooks.on("pull_request.assigned", issueOrPrAssigned);
  webhooks.on("pull_request.review_requested", reviewRequested);

  webhooks.onError((error) => {
    logger.error(error, "GitHub webhook error");
    Sentry.captureException(error);
  });
}

async function installationDeleted(event: EmitterWebhookEvent<"installation.deleted">) {
  try {
    await db.github_installation.deleteMany({
      where: {
        installation_id: event.payload.installation.id,
      },
    });
  } catch (e) {
    logger.error("installation.deleted error: " + e);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function installationCreated(event: EmitterWebhookEvent<"installation.created">) {
  // this is ignored for now
}

// for now, we only support mentions in newly created comments
async function commentCreated(event: EmitterWebhookEvent<"issue_comment.created">) {
  const installationId = event.payload.installation?.id;
  if (!installationId) throw new Error("installation id is missing");

  const commentCreator = event.payload.comment.user;
  const mentionUsers = [...event.payload.comment.body.matchAll(/@([a-z\-\d]+)/gim)]
    .map((m) => m[1])
    .filter((m) => m && m.toLowerCase() !== commentCreator.login.toLowerCase());

  const [ghAccounts, commentCreatorAccount] = await Promise.all([
    db.github_account_to_installation.findMany({
      where: {
        github_installation: {
          installation_id: installationId,
        },
        github_account: {
          github_login: {
            in: mentionUsers,
          },
        },
      },
      include: { github_account: { include: { user: true } } },
    }),
    db.github_account_to_installation.findFirst({
      where: {
        github_installation: {
          installation_id: installationId,
        },
        github_account: {
          github_user_id: commentCreator.id,
        },
      },
      include: { github_account: { include: { user: true } } },
    }),
  ]);

  const commentCreatorName = commentCreatorAccount?.github_account.user.name || commentCreator.login;
  const notificationPromises = ghAccounts.map((a) =>
    db.notification_github.create({
      data: {
        notification: {
          create: {
            user_id: a.user_id,
            url: event.payload.comment.html_url,
            from: commentCreatorName,
          },
        },
        type: "mention",
        issue_id: event.payload.issue.id,
        title: event.payload.issue.title,
        repository_id: event.payload.repository.id,
        repository_full_name: event.payload.repository.full_name,
      },
    })
  );
  await Promise.all(notificationPromises);
}

async function issueOrPrAssigned(
  event: EmitterWebhookEvent<"issues.assigned"> | EmitterWebhookEvent<"pull_request.assigned">
) {
  const installationId = event.payload.installation?.id;
  if (!installationId) throw new Error("installation id is missing");
  if (!event.payload.assignee) throw new Error("assignee is missing");

  const senderId = event.payload.sender.id;
  const assigneeId = event.payload.assignee.id;
  // ignore self-assignments
  if (senderId === assigneeId) return;

  const [senderAccount, assigneeAccount] = await getAccounts(installationId, [senderId, assigneeId]);
  if (!assigneeAccount) return;
  const senderName = senderAccount?.github_account.user.name || event.payload.sender.login;

  const isIssue = event.name === "issues";
  const issueOrPr = isIssue ? event.payload.issue : event.payload.pull_request;

  await db.notification_github.create({
    data: {
      notification: {
        create: {
          user_id: assigneeAccount.user_id,
          url: issueOrPr.html_url,
          from: senderName,
        },
      },
      type: "assign",
      issue_id: isIssue ? issueOrPr.id : null,
      pr_id: !isIssue ? issueOrPr.id : null,
      title: issueOrPr.title,
      repository_id: event.payload.repository.id,
      repository_full_name: event.payload.repository.full_name,
    },
  });
}

async function reviewRequested(event: EmitterWebhookEvent<"pull_request.review_requested">) {
  const installationId = event.payload.installation?.id;
  if (!installationId) throw new Error("installation id is missing");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestedReviewer: User = (event.payload as any).requested_reviewer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestedTeam: Team = (event.payload as any).requested_team;
  if (!requestedReviewer && !requestedTeam) throw new Error("requested_reviewer and requested_team are missing");

  if (!requestedReviewer && requestedTeam) {
    // TODO: handle team review requests (requested_team)
    logger.warn(`requested_reviewer is missing but requested_team is ${JSON.stringify(requestedTeam)}`);
    return;
  }

  const senderId = event.payload.sender.id;
  const requestedReviewerId = requestedReviewer.id;
  // ignore self-assinged review request
  if (senderId === requestedReviewerId) return;

  const [senderAccount, requestedReviewerAccount] = await getAccounts(installationId, [senderId, requestedReviewerId]);
  if (!requestedReviewerAccount) return;
  const senderName = senderAccount?.github_account.user.name || event.payload.sender.login;

  await db.notification_github.create({
    data: {
      notification: {
        create: {
          user_id: requestedReviewerAccount.user_id,
          url: event.payload.pull_request.html_url,
          from: senderName,
        },
      },
      type: "review",
      pr_id: event.payload.pull_request.id,
      title: event.payload.pull_request.title,
      repository_id: event.payload.repository.id,
      repository_full_name: event.payload.repository.full_name,
    },
  });
}

async function getAccounts(installationId: number, accountIds: number[]) {
  const accounts = await db.github_account_to_installation.findMany({
    where: {
      github_installation: {
        installation_id: installationId,
      },
      github_account: {
        github_user_id: {
          in: accountIds,
        },
      },
    },
    include: { github_account: { include: { user: true } } },
  });
  return accountIds.map((id) => accounts.find((a) => a.github_account.github_user_id === id));
}
