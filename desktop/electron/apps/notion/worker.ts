import * as Sentry from "@sentry/electron";
import { differenceInMinutes } from "date-fns";
import { BrowserWindow } from "electron";
import fetch from "node-fetch";

import {
  NotionNotificationType,
  NotionWorkerSync,
  notionSelectedSpaceValue,
  notionSyncPayload,
} from "@aca/desktop/bridge/apps/notion";
import { authTokenBridgeValue, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { ServiceSyncController } from "@aca/desktop/electron/apps/types";
import { assert } from "@aca/shared/assert";

import { ActivityPayload, BlockPayload, GetNotificationLogResult, GetSpacesResult, NotificationPayload } from "./types";

const WINDOW_BLURRED_INTERVAL = 15 * 60 * 1000; // 15 minutes;
const WINDOW_FOCUSED_INTERVAL = 90 * 1000; // 90 seconds;

let currentInterval: NodeJS.Timer | null = null;
let timeOfLastSync: Date | null = null;
let isSyncing = false;

const stripDashes = (str: string) => str.replaceAll("-", "");
const notionURL = "https://www.notion.so";

export function isNotionReadyToSync() {
  return authTokenBridgeValue.get() !== null && notionAuthTokenBridgeValue.get() !== null;
}

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
    if (isSyncing) {
      return;
    }

    try {
      isSyncing = true;
      console.info(`[Notion](${new Date().toISOString()}) Capturing started`);
      const notificationLog = await fetchNotionNotificationLog(window);

      notionSyncPayload.send(extractNotifications(notificationLog));

      timeOfLastSync = new Date();

      console.info(`[Notion](${new Date().toISOString()}) Capturing complete`);
    } catch (e) {
      console.info("[Notion] Error syncing notion", e);
      Sentry.captureException(e);
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

async function fetchNotionNotificationLog(window: BrowserWindow) {
  const cookies = await window.webContents.session.cookies.get({
    url: notionURL,
  });

  if (!cookies) {
    throw new Error("[Notion] unable to sync: no cookies");
  }

  const spaceId = await fetchCurrentSpace(window);

  if (!spaceId) {
    throw new Error("[Notion] Unable to fetch spaceId");
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
      spaceId,
      size: 20,
      type: "mentions",
    }),
  });

  if (response.status === 401) {
    notionAuthTokenBridgeValue.set(null);
    throw new Error("[Notion] Unauthorized");
  }

  return (await response.json()) as GetNotificationLogResult;
}

async function fetchCurrentSpace(window: BrowserWindow) {
  const cookies = await window.webContents.session.cookies.get({
    url: notionURL,
  });

  if (!cookies) {
    throw new Error("[Notion] unable to sync no cookies");
  }

  const notionUserId = cookies.find((cookie) => cookie.name === "notion_user_id");

  assert(notionUserId, "[Notion] Unable to extract notion user id from cookie");

  const response = await fetch(notionURL + "/api/v3/getSpaces", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookies
        .filter((cookie) => cookie.domain?.includes("notion.so"))
        .map((cookie) => cookie.name + "=" + cookie.value)
        .join("; "),
    },
    body: JSON.stringify({}),
  });

  if (response.status === 401) {
    notionAuthTokenBridgeValue.set(null);
    throw new Error("[Notion] 401 - Unauthorized");
  }

  const getSpacesResult = (await response.json()) as GetSpacesResult;

  const currentUserSpaces = getSpacesResult[notionUserId.value].space;

  const allSpaces = Object.values(currentUserSpaces).map((space) => ({ id: space.value.id, name: space.value.name }));

  if (allSpaces.length === 0) {
    throw new Error("[Notion] Unable to find any spaces in account");
  }

  const savedSpaces = notionSelectedSpaceValue.get();

  const selected = savedSpaces?.selected?.length > 0 ? savedSpaces.selected : [allSpaces[0].id];

  notionSelectedSpaceValue.set({
    selected,
    allSpaces,
  });

  return selected[0];
}

function extractNotifications(payload: GetNotificationLogResult): NotionWorkerSync {
  const { notificationIds, recordMap } = payload;

  const result: NotionWorkerSync = [];

  for (const id of notificationIds) {
    const notification = recordMap.notification[id].value;

    const urlAndType = getUrlAndType(notification, recordMap);
    if (!urlAndType) {
      console.info(`[Notion] Unable to handle notification ${id} of type ${notification.type}`);
      Sentry.captureException(`[Notion] Unable to handle notification of type ${notification.type}`);
      continue;
    }

    const { url, type } = urlAndType;

    const pageId = notification.navigable_block_id;
    const activity = (recordMap.activity[notification.activity_id] as ActivityPayload<"user-mentioned">).value;

    const createdAtTimestampAsNumber = Number.parseInt(notification.end_time);

    const created_at = new Date(createdAtTimestampAsNumber).toISOString();

    const pageBlock = (recordMap.block[pageId] as BlockPayload<"page">).value;

    if (pageBlock.type !== "page") {
      console.info(`[Notion] Block is not page type, instead its: '${notification.type}'`);
      Sentry.captureException(`[Notion] Block is not page type, instead its: '${notification.type}'`);
      continue;
    }

    const updated_at = created_at;
    result.push({
      notification: {
        url,
        created_at,
        updated_at,
        from: recordMap.notion_user[activity.edits[0].authors[0].id]?.value.name ?? "Notion",
      },
      type,
      notionNotification: {
        notion_original_notification_id: id,
        page_id: pageId,
        page_title: pageBlock.properties.title[0][0],
      },
    });
  }

  return result;
}

function getUrlAndType(
  notification: NotificationPayload["value"],
  recordMap: GetNotificationLogResult["recordMap"]
): { type: NotionNotificationType; url: string } | undefined {
  const pageId = notification.navigable_block_id;

  if (notification.type === "user-mentioned") {
    const activity = (recordMap.activity[notification.activity_id] as ActivityPayload<"user-mentioned">).value;
    const url =
      notionURL +
      "/" +
      stripDashes(pageId) +
      (pageId !== activity.mentioned_block_id ? `#${stripDashes(activity.mentioned_block_id)}` : "");

    return {
      type: "notification_notion_user_mentioned",
      url,
    };
  }

  if (notification.type === "commented") {
    const activity = (recordMap.activity[notification.activity_id] as ActivityPayload<"commented">).value;
    const discussion = recordMap.discussion[activity.discussion_id].value;

    const parentDiscussionBlock = discussion.parent_id;
    const url =
      notionURL +
      "/" +
      stripDashes(pageId) +
      "?d=" +
      `${stripDashes(discussion.id)}` +
      `#${stripDashes(parentDiscussionBlock)}`;

    return {
      type: "notification_notion_commented",
      url,
    };
  }

  if (notification.type === "user-invited") {
    const url = notionURL + "/" + stripDashes(pageId);

    return {
      type: "notification_notion_user_invited",
      url,
    };
  }
}
