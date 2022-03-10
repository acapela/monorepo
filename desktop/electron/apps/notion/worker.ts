import { differenceInMinutes } from "date-fns";
import { session } from "electron";
import fetch from "node-fetch";

import {
  NotionNotificationType,
  NotionWorkerSync,
  notionAvailableSpacesValue,
  notionSelectedSpaceValue,
  notionSyncPayload,
} from "@aca/desktop/bridge/apps/notion";
import { authTokenBridgeValue, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { ServiceSyncController } from "@aca/desktop/electron/apps/types";
import { clearNotionSessionData, notionURL } from "@aca/desktop/electron/auth/notion";
import { assert } from "@aca/shared/assert";
import { wait } from "@aca/shared/time";

import { extractBlockMention, extractNotionComment } from "./commentExtractor";
import type {
  ActivityPayload,
  BlockPayload,
  CollectionViewPageBlockValue,
  GetNotificationLogResult,
  GetPublicSpaceDataResult,
  GetSpacesResult,
  NotificationPayload,
  PageBlockValue,
} from "./types";

const WINDOW_BLURRED_INTERVAL = 15 * 60 * 1000; // 15 minutes;
const WINDOW_FOCUSED_INTERVAL = 90 * 1000; // 90 seconds;

let currentInterval: NodeJS.Timer | null = null;
let timeOfLastSync: Date | null = null;
let isSyncing = false;

const log = makeLogger("Notion-Worker");

const stripDashes = (str: string) => str.replaceAll("-", "");

export function isNotionReadyToSync() {
  return authTokenBridgeValue.get() !== null && notionAuthTokenBridgeValue.get() !== null;
}

export interface NotionSessionData {
  cookie: string;
  notionUserId: string;
}

export async function getNotionSessionData(): Promise<NotionSessionData> {
  const cookies = await session.defaultSession.cookies.get({
    url: notionURL,
  });

  if (!cookies) {
    throw log.error(new Error("Unable to sync: no cookies"));
  }

  const notionUserId = cookies.find((cookie) => cookie.name === "notion_user_id")?.value;

  assert(notionUserId, "Unable to extract notion user id from cookies", log.error);

  const cookie = cookies
    .filter((cookie) => cookie.domain?.includes("notion.so"))
    .map((cookie) => cookie.name + "=" + cookie.value)
    .join("; ");

  return { cookie, notionUserId };
}

/*
  Pulling logic for notion
  - Pull immediately on app start
  - Pull every 15 minutes if main window is blurred
  - Pull ever 90 seconds if main window is focused
  - Pull immediately when window focuses if more than 5 minutes have passed before last pull
*/
export function startNotionSync(): ServiceSyncController {
  const sessionDataPromise = getNotionSessionData();

  async function runSync() {
    if (isSyncing) {
      return;
    }

    const sessionData = await sessionDataPromise;

    try {
      isSyncing = true;
      log.info(`Capturing started`);

      await updateAvailableSpaces(sessionData);

      const syncEnabledSpaces = notionSelectedSpaceValue.get();

      for (const spaceToSync of syncEnabledSpaces.selected) {
        const notificationLog = await fetchNotionNotificationLog(sessionData, spaceToSync);
        notionSyncPayload.send(extractNotifications(notificationLog));
        await wait(10000);
      }

      timeOfLastSync = new Date();

      log.info(`Capturing complete`);
    } catch (e: unknown) {
      log.error(e as Error);
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
    serviceName: "notion",
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
    forceSync() {
      runSync();
    },
  };
}

async function fetchNotionNotificationLog(sessionData: NotionSessionData, spaceId: string) {
  const response = await fetch(notionURL + "/api/v3/getNotificationLog", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionData.cookie,
    },
    body: JSON.stringify({
      // Notion uses the space id for tracking within their help-desk
      spaceId,
      size: 20,
      type: "mentions",
    }),
  });

  if (!response.ok) {
    clearNotionSessionData();
    throw log.error(new Error("getNotificationLog"), `${response.status} - ${response.statusText}`);
  }

  const result = (await response.json()) as GetNotificationLogResult;

  return result;
}

async function updateAvailableSpaces(sessionData: NotionSessionData) {
  const getSpacesResponse = await fetch(notionURL + "/api/v3/getSpaces", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionData.cookie,
    },
    body: JSON.stringify({}),
  });

  if (!getSpacesResponse.ok) {
    clearNotionSessionData();
    throw log.error(new Error(`getSpaces`), `${getSpacesResponse.status} - ${getSpacesResponse.statusText}`);
  }

  /*
    The getSpaces endpoint includes information about the spaces that users is a member from.
    It also includes the concept of a `space_view` which includes a bit of information about all
    the spaces the user is involved with, i.e including spaces where there user is a guest.
  */
  const getSpacesResult = (await getSpacesResponse.json()) as GetSpacesResult;

  // Includes spaces that you're a member of and spaces where you're a guest
  const allSpaceIds = Object.values(getSpacesResult[sessionData.notionUserId].space_view).map(
    (view) => view.value.space_id
  );

  /*
    We use the getPublicSpaceData endpoint to get the name of all spaces. Using the result from `getSpaces`
    didn't provide us with the name of spaces the user was a guest in.
    We're still able to get notifications from spaces in which the user only has guest access.
  */
  const getPublicSpaceDataResponse = await fetch(notionURL + "/api/v3/getPublicSpaceData", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionData.cookie,
    },
    body: JSON.stringify({
      spaceIds: allSpaceIds,
      type: "space-ids",
    }),
  });

  if (!getPublicSpaceDataResponse.ok) {
    clearNotionSessionData();
    throw log.error(new Error(`getPublicSpaceData`), `${getSpacesResponse.status} - ${getSpacesResponse.statusText}`);
  }

  const getPublicSpacesResult = (await getPublicSpaceDataResponse.json()) as GetPublicSpaceDataResult;

  const allSpaces = getPublicSpacesResult.results.map(({ id, name }) => ({ id, name }));

  if (allSpaces.length === 0) {
    throw log.error(new Error(`Unable to find any spaces in account`));
  }

  const savedSpaces = notionAvailableSpacesValue.get();

  const hasNewSpaces = !allSpaces.every((synchedSpace) =>
    savedSpaces.spaces.some((savedSpace) => savedSpace.id === synchedSpace.id)
  );

  if (hasNewSpaces) {
    notionAvailableSpacesValue.set({ spaces: allSpaces });
  }
}

function extractNotifications(payload: GetNotificationLogResult): NotionWorkerSync {
  const { notificationIds, recordMap } = payload;

  const result: NotionWorkerSync = [];

  log.debug(`Found ${notificationIds.length} notifications`);
  for (const id of notificationIds) {
    const notification = recordMap.notification[id].value;

    const notificationProperties = getNotificationProperties(notification, recordMap);
    if (!notificationProperties) {
      log.error(`Unable to handle notification ${id} of type ${notification.type}`);
      continue;
    }

    const { url, type, text_preview } = notificationProperties;

    const activity = (recordMap.activity[notification.activity_id] as ActivityPayload<"commented">).value;

    const createdAtTimestampAsNumber = Number.parseInt(notification.end_time);

    const created_at = new Date(createdAtTimestampAsNumber).toISOString();

    const page_title = getPageTitle(notification, recordMap);

    if (!page_title) {
      log.error(`Page title not found for notification_id ${notification.id}`, recordMap);
      continue;
    }

    const updated_at = created_at;
    const authorId = activity.edits[0].authors[0].id;
    result.push({
      notification: {
        url,
        text_preview,
        created_at,
        updated_at,
        from: recordMap.notion_user[authorId]?.value?.name ?? "Notion",
      },
      type,
      notionNotification: {
        notion_original_notification_id: id,
        page_id: notification.navigable_block_id,
        page_title,
        synced_spaced_id: notification.space_id,
        author_id: authorId,
      },
      discussion_id: notificationProperties.discussion_id,
    });
  }

  return result;
}

function getPageTitle(
  notification: NotificationPayload["value"],
  recordMap: GetNotificationLogResult["recordMap"]
): string | undefined {
  const blockId = notification.navigable_block_id;
  const typeOfBlock = recordMap.block[blockId]?.value.type;

  if (typeOfBlock === "page") {
    const block = (recordMap.block[blockId] as BlockPayload<"page">).value as PageBlockValue;
    return block.properties.title[0][0];
  }

  if (typeOfBlock === "collection_view_page") {
    const block = (recordMap.block[blockId] as BlockPayload<"collection_view_page">)
      .value as CollectionViewPageBlockValue;
    const collection = recordMap.collection && recordMap.collection[block.collection_id].value;
    if (!collection) {
      log.error(
        `Collection not found for notification_id ${notification.id} block.collection_id: ${block.collection_id}`,
        recordMap
      );
      return;
    }

    return collection.name[0][0];
  }

  return;
}

function getNotificationProperties(
  notification: NotificationPayload["value"],
  recordMap: GetNotificationLogResult["recordMap"]
):
  | { type: NotionNotificationType; url: string; text_preview?: string | undefined; discussion_id?: string | undefined }
  | undefined {
  const pageId = notification.navigable_block_id;

  if (!pageId) return;

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
      text_preview: extractBlockMention(activity, recordMap),
    };
  }

  if (notification.type === "commented") {
    const activity = (recordMap.activity[notification.activity_id] as ActivityPayload<"commented">).value;

    // https://sentry.io/organizations/acapela/issues/3086700355/?project=6170771
    if (!activity) {
      log.error(
        `Comment Activity for notification id ${notification.id} not found in recordMap: `,
        JSON.stringify(recordMap, null, 2)
      );
      return;
    }

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
      text_preview: extractNotionComment(activity, recordMap),
      discussion_id: activity.discussion_id,
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
