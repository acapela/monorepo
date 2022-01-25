import { differenceInMinutes } from "date-fns";
import { BrowserWindow } from "electron";
import fetch from "node-fetch";

import { Notification, Notification_Notion_User_Mentioned, Notion_Page } from "@aca/gql";
import { getUUID } from "@aca/shared/uuid";

import { ActivityPayload, BlockPayload, GetNotificationLogResult } from "./types";
import { ServiceSyncController } from "..";

type NotionNotificationPartial = Omit<Notification, "resolved_at" | "user_id" | "__typename">;
type NotificationNotionUserMentionedPartial = Omit<
  Notification_Notion_User_Mentioned,
  "__typename" | "notion_page" | "notification"
>;
type NotionPagePartial = Omit<Notion_Page, "__typename" | "notification_notion_user_mentioneds">;

interface NotionWorkerSync {
  notification: NotionNotificationPartial[];
  userMentionedNotification: NotificationNotionUserMentionedPartial[];
  notionPage: NotionPagePartial[];
}

const WINDOW_BLURRED_INTERVAL = 900000; // 15 minutes;
const WINDOW_FOCUSED_INTERVAL = 90000; // 90 seconds;

let currentInterval: NodeJS.Timer | null = null;
let timeOfLastSync: Date | null = null;

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
    const notificationLog = await fetchNotionNotificationLog(window);
    const { notification, userMentionedNotification } = extractNotifications(notificationLog);
    const notionPage = extractPages(
      notificationLog,
      userMentionedNotification.map((n) => n.notion_page_id)
    );

    syncWithClientDb({ notification, userMentionedNotification, notionPage });
    timeOfLastSync = new Date();
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
      const isLongTimeSinceLastFocus = differenceInMinutes(now, timeOfLastSync ?? now) > 5;
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

function extractNotifications(payload: GetNotificationLogResult): {
  notification: NotionNotificationPartial[];
  userMentionedNotification: NotificationNotionUserMentionedPartial[];
} {
  const { notificationIds, recordMap } = payload;

  const stripDashes = (str: string) => str.replaceAll("-", "");

  const result = {
    notification: [],
    userMentionedNotification: [],
  } as ReturnType<typeof extractNotifications>;

  for (const id of notificationIds) {
    const notification = recordMap.notification[id].value;

    if (notification.type !== "user-mentioned") {
      continue;
    }

    const pageId = notification.navigable_block_id;
    const activity = (recordMap.activity[notification.activity_id] as ActivityPayload<"user-mentioned">).value;
    const url =
      notionURL +
      "/" +
      stripDashes(pageId) +
      (pageId !== activity.mentioned_block_id ? `#${stripDashes(activity.mentioned_block_id)}` : "");
    const created_at = notification.end_time;
    const updated_at = created_at;
    result.notification.push({
      id,
      url,
      created_at,
      updated_at,
    });
    result.userMentionedNotification.push({
      id: getUUID(),
      notification_id: id,
      created_at,
      updated_at,
      notion_page_id: pageId,
      from: recordMap.notion_user[activity.edits[0].authors[0].id]?.value.name ?? "Notion",
    });
  }

  return result;
}

function extractPages(payload: GetNotificationLogResult, pageIds: string[]): NotionPagePartial[] {
  const result = [] as NotionPagePartial[];

  for (const pageId of pageIds) {
    const pageBlock = (payload.recordMap.block[pageId] as BlockPayload<"page">).value;

    if (pageBlock.type !== "page") {
      console.error("[Notion Worker] Block is not page type");
      continue;
    }

    result.push({
      id: pageId,
      title: pageBlock.properties.title[0][0],
      created_at: `${pageBlock.created_time}`,
      updated_at: `${pageBlock.last_edited_time}`,
    });
  }

  return result;
}

function syncWithClientDb(data: NotionWorkerSync) {
  // eslint-disable-next-line no-console
  console.log(data);
}
