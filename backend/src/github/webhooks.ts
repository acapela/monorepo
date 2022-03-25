import { EmitterWebhookEvent, Webhooks } from "@octokit/webhooks";

import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

export function addWebhookHandlers(webhooks: Webhooks) {
  webhooks.on("installation.deleted", installationDeleted);
  webhooks.on("installation.created", installationCreated);

  webhooks.on("issue_comment.created", commentCreated);

  webhooks.on("issues.assigned", issueAssigned);
  webhooks.on("pull_request.assigned", (event) => {
    console.info("pull_request.assigned", event.payload);
  });

  webhooks.on("issues.opened", (event) => {
    console.info("issues.opened", event.payload);
  });

  webhooks.on("pull_request.opened", (event) => {
    console.info("pull_request.opened", event.payload);
  });
}

async function installationDeleted(event: EmitterWebhookEvent<"installation.deleted">) {
  try {
    await Promise.all([
      db.github_installation.deleteMany({
        where: {
          id: event.payload.installation.id,
        },
      }),
      db.github_account_to_installation.deleteMany({
        where: {
          installation_id: event.payload.installation.id,
        },
      }),
    ]);
  } catch (e) {
    logger.error("installation.deleted error: " + e);
  }
}

async function installationCreated(event: EmitterWebhookEvent<"installation.created">) {
  await db.github_installation.create({
    data: {
      id: event.payload.installation.id,
      account_id: event.payload.installation.target_id,
      account_login: event.payload.installation.account.login,
      target_type: event.payload.installation.target_type,
      repository_selection: event.payload.installation.repository_selection,
    },
  });
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
        installation_id: installationId,
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
        installation_id: installationId,
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
        issue_title: event.payload.issue.title,
      },
    })
  );
  await Promise.all(notificationPromises);
}

async function issueAssigned(event: EmitterWebhookEvent<"issues.assigned">) {
  const installationId = event.payload.installation?.id;
  if (!installationId) throw new Error("installation id is missing");
  if (!event.payload.assignee) throw new Error("assignee is missing");

  const accounts = await db.github_account_to_installation.findMany({
    where: {
      installation_id: installationId,
      github_account: {
        github_user_id: {
          in: [event.payload.sender.id, event.payload.assignee.id],
        },
      },
    },
    include: { github_account: { include: { user: true } } },
  });

  const assigneeAccount = accounts.find((a) => a.github_account.github_user_id === event.payload.assignee?.id);
  if (!assigneeAccount) return;

  const senderAccount = accounts.find((a) => a.github_account.github_user_id === event.payload.sender.id);
  const senderName = senderAccount?.github_account.user.name || event.payload.sender.login;

  await db.notification_github.create({
    data: {
      notification: {
        create: {
          user_id: assigneeAccount.user_id,
          url: event.payload.issue.html_url,
          from: senderName,
        },
      },
      type: "assign",
      issue_id: event.payload.issue.id,
      issue_title: event.payload.issue.title,
    },
  });
}
