import axios from "axios";

import { ClickUpAccount, ClickUpAccountToTeam, ClickUpTeam, db } from "@aca/db";

import { User, Webhook } from "./types";
import { API_ENDPOINT } from "./utils";

type DbTeam = ClickUpTeam & {
  clickup_account_to_team: (ClickUpAccountToTeam & { clickup_account: ClickUpAccount })[];
};

async function getRandomToken(accounts: ClickUpAccount[]): Promise<string> {
  for (let i = 0; i < 3; i++) {
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const token = account.access_token;
    const headers = { Authorization: token };
    try {
      await axios.get(`${API_ENDPOINT}/user`, { headers });
      return token;
    } catch (e) {
      // token failed, let's retry
    }
  }
  throw new Error("Could not get a valid clickup token");
}

async function fetchTask(token: string, taskId: string) {
  const headers = { Authorization: token };
  return (await axios.get(`${API_ENDPOINT}/task/${taskId}`, { headers })).data;
}

function isWatchedByUser(watchers: User[], userId: string): boolean {
  return watchers.some((watcher) => `${watcher.id}` === userId);
}

export async function processEvent(webhook: Webhook, team: DbTeam) {
  const userByClickUpUserID = team.clickup_account_to_team.reduce((acc, cur) => {
    acc[cur.clickup_account.clickup_user_id] = cur.clickup_account;
    return acc;
  }, {} as { [key: string]: ClickUpAccount });

  const randomToken = await getRandomToken(Object.values(userByClickUpUserID));
  switch (webhook.event) {
    case "taskAssigneeUpdated": {
      const hist = webhook.history_items.find((h) => h.field === "assignee_add");
      if (!hist) return;
      if (hist.after.id === hist.user.id) return;
      const assigneeUser = userByClickUpUserID[hist.after.id];
      if (!assigneeUser) return;
      const task = await fetchTask(assigneeUser.access_token, webhook.task_id);
      await createAssignNotification({
        userId: assigneeUser.user_id,
        taskId: webhook.task_id,
        taskName: task.name,
        fromName: hist.user.username,
      });
      return;
    }
    case "taskCommentPosted": {
      const hist = webhook.history_items.find((h) => h.field === "comment");
      if (!hist) return;
      const mentions = hist.comment.comment
        .filter((c: { type: string; user: unknown }) => c.type === "tag" && c.user)
        .map((c: { user: { id: number } }) => userByClickUpUserID[c.user.id]?.user_id)
        .filter(Boolean) as string[];
      const task = await fetchTask(randomToken, webhook.task_id);
      await Promise.all(
        team.clickup_account_to_team
          .filter((at) => at.clickup_account.clickup_user_id !== `${hist.user.id}`)
          .filter((at) => isWatchedByUser(task.watchers, at.clickup_account.clickup_user_id))
          .map((at) => at.clickup_account.user_id)
          .map((uid) =>
            createCommentNotification({
              userId: uid,
              taskId: webhook.task_id,
              commentId: hist.comment.id,
              taskName: task.name,
              fromName: hist.user.username,
              isMention: mentions.includes(uid),
            })
          )
      );
      return;
    }
    case "taskCreated": {
      const hist = webhook.history_items.find((h) => h.field === "task_creation");
      if (!hist) return;
      const task = await fetchTask(randomToken, webhook.task_id);
      await Promise.all(
        team.clickup_account_to_team
          .filter((at) => at.clickup_account.clickup_user_id !== `${hist.user.id}`)
          .map((at) => at.clickup_account.user_id)
          .map((uid) =>
            createTaskNotification({
              userId: uid,
              taskId: webhook.task_id,
              taskName: task.name,
              fromName: hist.user.username,
            })
          )
      );
      return;
    }
    case "taskDueDateUpdated": {
      const hist = webhook.history_items.find((h) => h.field === "due_date");
      if (!hist) return;
      const task = await fetchTask(randomToken, webhook.task_id);
      await Promise.all(
        team.clickup_account_to_team
          .filter((at) => at.clickup_account.clickup_user_id !== `${hist.user.id}`)
          .filter((at) => isWatchedByUser(task.watchers, at.clickup_account.clickup_user_id))
          .map((at) => at.clickup_account.user_id)
          .map((uid) =>
            createValueNotification({
              type: "due",
              userId: uid,
              taskId: webhook.task_id,
              taskName: task.name,
              fromName: hist.user.username,
              value: hist.after,
            })
          )
      );
      return;
    }
    case "taskPriorityUpdated": {
      const hist = webhook.history_items.find((h) => h.field === "priority");
      if (!hist) return;
      const task = await fetchTask(randomToken, webhook.task_id);
      await Promise.all(
        team.clickup_account_to_team
          .filter((at) => at.clickup_account.clickup_user_id !== `${hist.user.id}`)
          .filter((at) => isWatchedByUser(task.watchers, at.clickup_account.clickup_user_id))
          .map((at) => at.clickup_account.user_id)
          .map((uid) =>
            createValueNotification({
              type: "priority",
              userId: uid,
              taskId: webhook.task_id,
              taskName: task.name,
              fromName: hist.user.username,
              value: hist.after.priority,
            })
          )
      );
      return;
    }
    case "taskStatusUpdated": {
      const hist = webhook.history_items.find((h) => h.field === "status");
      if (!hist) return;
      // task was just created
      if (!hist.before?.status) return;
      const task = await fetchTask(randomToken, webhook.task_id);
      await Promise.all(
        team.clickup_account_to_team
          .filter((at) => at.clickup_account.clickup_user_id !== `${hist.user.id}`)
          .filter((at) => isWatchedByUser(task.watchers, at.clickup_account.clickup_user_id))
          .map((at) => at.clickup_account.user_id)
          .map((uid) =>
            createValueNotification({
              type: "status",
              userId: uid,
              taskId: webhook.task_id,
              taskName: task.name,
              fromName: hist.user.username,
              value: hist.after.status,
            })
          )
      );
      return;
    }
  }

  throw new Error("Unhandled webhook type");
}

async function createAssignNotification(data: { userId: string; taskId: string; taskName: string; fromName: string }) {
  return db.notification_clickup.create({
    data: {
      notification: {
        create: {
          user_id: data.userId,
          url: `https://app.clickup.com/t/${data.taskId}`,
          from: data.fromName,
        },
      },
      type: "assign",
      title: data.taskName,
      task_id: data.taskId,
    },
  });
}

async function createCommentNotification(data: {
  userId: string;
  taskId: string;
  commentId: string;
  taskName: string;
  fromName: string;
  isMention: boolean;
}) {
  return db.notification_clickup.create({
    data: {
      notification: {
        create: {
          user_id: data.userId,
          url: `https://app.clickup.com/t/${data.taskId}?comment=${data.commentId}`,
          from: data.fromName,
        },
      },
      type: data.isMention ? "mention" : "comment",
      title: data.taskName,
      task_id: data.taskId,
    },
  });
}

async function createTaskNotification(data: { userId: string; taskId: string; taskName: string; fromName: string }) {
  return db.notification_clickup.create({
    data: {
      notification: {
        create: {
          user_id: data.userId,
          url: `https://app.clickup.com/t/${data.taskId}`,
          from: data.fromName,
        },
      },
      type: "task",
      title: data.taskName,
      task_id: data.taskId,
    },
  });
}

async function createValueNotification(data: {
  type: "due" | "priority" | "status";
  userId: string;
  taskId: string;
  taskName: string;
  fromName: string;
  value: string;
}) {
  return db.notification_clickup.create({
    data: {
      notification: {
        create: {
          user_id: data.userId,
          url: `https://app.clickup.com/t/${data.taskId}`,
          from: data.fromName,
        },
      },
      type: `${data.type}:${data.value}`,
      title: data.taskName,
      task_id: data.taskId,
    },
  });
}
