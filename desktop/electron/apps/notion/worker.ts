import { differenceInMinutes } from "date-fns";
import { BrowserWindow } from "electron";
import fetch from "node-fetch";

import { NotionWorkerSync, notionSyncPayload } from "@aca/desktop/bridge/apps/notion";
import { authTokenBridgeValue, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { ServiceSyncController } from "@aca/desktop/electron/apps/types";

import { ActivityPayload, BlockPayload, GetNotificationLogResult, NotificationPayload } from "./types";

const WINDOW_BLURRED_INTERVAL = 15 * 60 * 1000; // 15 minutes;
const WINDOW_FOCUSED_INTERVAL = 90 * 1000; // 90 seconds;

let currentInterval: NodeJS.Timer | null = null;
let timeOfLastSync: Date | null = null;
let isSyncing = false;

/*
  Pulling logic for notion
  - Pull immediately on app start
  - Pull every 15 minutes if main window is blurred
  - Pull ever 90 seconds if main window is focused
  - Pull immediately when window focuses if more than 5 minutes have passed before last pull
*/
export function startNotionSync(): ServiceSyncController {
  const window = new BrowserWindow({
    width: 0,
    height: 0,
    webPreferences: {
      contextIsolation: true,
    },
  });

  window.hide();

  async function runSync() {
    const isAbleToSync = authTokenBridgeValue.get() !== null && notionAuthTokenBridgeValue.get() !== null;

    if (!isAbleToSync) {
      console.info("Notion worker capturing aborted: no session yet");
      return;
    }
    if (isSyncing) {
      return;
    }

    try {
      isSyncing = true;
      console.info(`[${new Date().toISOString()}] Notion worker capturing started`);

      const notificationLog = await fetchNotionNotificationLog(window);

      notionSyncPayload.send(extractNotifications(notificationLog));

      timeOfLastSync = new Date();

      console.info(`[${new Date().toISOString()}] Notion worker capturing complete`);
    } catch (e) {
      console.error("Error syncing notion", e);
    } finally {
      isSyncing = false;
    }
  }

  function restartPullInterval(timeInterval: number) {
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    currentInterval = setInterval(runSync, timeInterval);
  }

  runSync();

  return {
    onWindowFocus() {
      const now = new Date();
      const isLongTimeSinceLastFocus = !timeOfLastSync || differenceInMinutes(now, timeOfLastSync) > 5;

      if (isLongTimeSinceLastFocus) {
        runSync();
      }
      restartPullInterval(WINDOW_FOCUSED_INTERVAL);
    },
    onWindowBlur() {
      restartPullInterval(WINDOW_BLURRED_INTERVAL);
    },
  };
}

const notionURL = "https://www.notion.so";

async function fetchNotionNotificationLog(window: BrowserWindow) {
  const cookies = await window.webContents.session.cookies.get({
    url: notionURL,
  });

  if (!cookies) {
    console.error("unable to sync");
    throw new Error("unable to sync");
  }

  const response = await fetch(notionURL + "/api/v3/getNotificationLog", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookies
        .filter((cookie) => cookie.domain?.includes("notion.so"))
        .map((cookie) => cookie.name + "=" + cookie.value)
        .join("; "),
    },
    body: JSON.stringify({
      // Notion uses the space id for tracking within their help-desk
      spaceId: cookies.find((cookie) => cookie.name == "ajs_group_id")?.value,
      size: 20,
      type: "mentions",
    }),
  });

  return (await response.json()) as GetNotificationLogResult;
}

const stripDashes = (str: string) => str.replaceAll("-", "");

function extractNotifications(payload: GetNotificationLogResult): NotionWorkerSync {
  const { notificationIds, recordMap } = payload;

  const result: NotionWorkerSync = [];

  for (const id of notificationIds) {
    const notification = recordMap.notification[id].value;

    if (notification.type === "user-mentioned") {
      const userMentionedNotification = extractUserMentionedData(notification, recordMap);
      if (userMentionedNotification) {
        result.push(userMentionedNotification);
      }
      continue;
    }
    if (notification.type === "commented") {
      const commentedNotification = extractCommentData(notification, recordMap);
      if (commentedNotification) {
        result.push(commentedNotification);
      }
      continue;
    }
  }

  return result;
}

function extractUserMentionedData(
  notification: NotificationPayload["value"],
  recordMap: GetNotificationLogResult["recordMap"]
) {
  const pageId = notification.navigable_block_id;
  const activity = (recordMap.activity[notification.activity_id] as ActivityPayload<"user-mentioned">).value;
  const url =
    notionURL +
    "/" +
    stripDashes(pageId) +
    (pageId !== activity.mentioned_block_id ? `#${stripDashes(activity.mentioned_block_id)}` : "");

  const createdAtTimestampAsNumber = Number.parseInt(notification.end_time);

  const created_at = new Date(createdAtTimestampAsNumber).toISOString();

  const pageBlock = (recordMap.block[pageId] as BlockPayload<"page">).value;

  if (pageBlock.type !== "page") {
    console.error("[Notion Worker] Block is not page type");
    return;
  }

  const updated_at = created_at;
  return {
    notification: {
      id: notification.id,
      url,
      created_at,
      updated_at,
      from: recordMap.notion_user[activity.edits[0].authors[0].id]?.value.name ?? "Notion",
    },
    userMentioned: {
      notification_id: notification.id,
      created_at,
      updated_at,
      notion_page_id: pageId,
      notion_page_title: pageBlock.properties.title[0][0],
    },
  } as const;
}

function extractCommentData(
  notification: NotificationPayload["value"],
  recordMap: GetNotificationLogResult["recordMap"]
) {
  const pageId = notification.navigable_block_id;
  const activity = (recordMap.activity[notification.activity_id] as ActivityPayload<"commented">).value;
  const discussion = recordMap.discussion[activity.discussion_id].value;

  const parentDiscussionBlock = discussion.parent_id;

  const pageBlock = (recordMap.block[pageId] as BlockPayload<"page">).value;

  if (pageBlock.type !== "page") {
    console.error("[Notion Worker] Block is not page type");
    return;
  }

  const url =
    notionURL +
    "/" +
    stripDashes(pageId) +
    "?d=" +
    `${stripDashes(discussion.id)}` +
    `#${stripDashes(parentDiscussionBlock)}`;

  const createdAtTimestampAsNumber = Number.parseInt(notification.end_time);

  const created_at = new Date(createdAtTimestampAsNumber).toISOString();

  const updated_at = created_at;
  return {
    notification: {
      id: notification.id,
      url,
      created_at,
      updated_at,
      from: recordMap.notion_user[activity.edits[0].authors[0].id]?.value.name ?? "Notion",
    },
    commented: {
      notification_id: notification.id,
      created_at,
      updated_at,
      notion_page_id: pageId,
      notion_page_title: pageBlock.properties.title[0][0],
    },
  } as const;
}
