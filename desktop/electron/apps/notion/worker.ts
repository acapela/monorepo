import axios from "axios";
import { session } from "electron";
import { z } from "zod";

import {
  NotionNotificationType,
  NotionWorkerSync,
  notionAvailableSpacesValue,
  notionSelectedSpaceValue,
  notionSyncPayload,
} from "@aca/desktop/bridge/apps/notion";
import { authTokenBridgeValue, loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { ServiceSyncController, makeServiceSyncController } from "@aca/desktop/electron/apps/serviceSyncController";
import { clearNotionSessionData, notionDomain, notionURL } from "@aca/desktop/electron/auth/notion";
import { assert } from "@aca/shared/assert";
import { timeDuration, wait } from "@aca/shared/time";

import { extractBlockMention, extractNotionComment } from "./commentExtractor";
import {
  ActivityValueCommon,
  CollectionViewPageBlockValue,
  CommentedActivityValue,
  GetNotificationLogResult,
  GetPublicSpaceDataResult,
  GetSpacesResult,
  Notification,
  RecordMap,
  SomeBlockValue,
  UserInvitedActivityValue,
  UserMentionedActivityValue,
} from "./schema";

const log = makeLogger("Notion-Worker");

const stripDashes = (str: string) => str.replaceAll("-", "");

export function isNotionReadyToSync() {
  return authTokenBridgeValue.get() !== null && notionAuthTokenBridgeValue.get() !== null;
}

export interface NotionSessionData {
  cookie: string;
  notionUserId: string;
}

function handleNotionNotAuthorized() {
  clearNotionSessionData();

  addToast({
    title: "Notion Sync Stopped",
    message: "Please reconnect to restart sync",
    durationMs: 2 * timeDuration.day,
    action: {
      label: "Reconnect",
      callback: () => loginNotionBridge(),
    },
  });
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

export function startNotionSync(): ServiceSyncController {
  return makeServiceSyncController("notion", notionDomain, runSync);
}

async function runSync() {
  const sessionData = await getNotionSessionData();

  log.info(`Capturing started`);

  await updateAvailableSpaces();

  const syncEnabledSpaces = notionSelectedSpaceValue.get();

  log.debug(`Capturing from ${syncEnabledSpaces.selected.length} spaces`);

  for (const spaceToSync of syncEnabledSpaces.selected) {
    log.debug(`Capturing started for space: ${spaceToSync}`);

    const notificationLog = await fetchNotionNotificationLog(sessionData, spaceToSync);
    if (notificationLog) {
      notionSyncPayload.send(extractNotifications(notificationLog));
    }

    await wait(10000);
  }
}

async function fetchNotionNotificationLog(sessionData: NotionSessionData, spaceId: string) {
  const response = await axios
    .post(
      notionURL + "/api/v3/getNotificationLog",
      {
        // Notion uses the space id for tracking within their help-desk
        spaceId,
        size: 20,
        type: "mentions",
      },
      { headers: { cookie: sessionData.cookie } }
    )
    .catch(({ response }) => {
      if (response?.status >= 400 && response?.status < 500) {
        handleNotionNotAuthorized();

        throw log.error(new Error("getNotificationLog"), `${response.status} - ${response.statusText}`);
      }
    });

  if (!response) {
    return;
  }

  return GetNotificationLogResult.parse(response.data);
}

export async function updateAvailableSpaces() {
  const sessionData = await getNotionSessionData();

  const spacesResponse = await axios
    .post(notionURL + "/api/v3/getSpaces", {}, { headers: { cookie: sessionData.cookie } })
    .catch(({ response }) => {
      if (response?.status >= 400 && response?.status < 500) {
        handleNotionNotAuthorized();

        throw new Error(`getSpaces: ${response.status} - ${response.statusText}`);
      }
    });

  if (!spacesResponse) {
    return;
  }

  /*
    The getSpaces endpoint includes information about the spaces that users is a member from.
    It also includes the concept of a `space_view` which includes a bit of information about all
    the spaces the user is involved with, i.e including spaces where there user is a guest.
  */
  const getSpacesResult = GetSpacesResult.parse(spacesResponse.data);

  // Includes spaces that you're a member of and spaces where you're a guest
  const allSpaceIds = Object.values(getSpacesResult[sessionData.notionUserId].space_view).map(
    (view) => view.value.space_id
  );

  /*
    We use the getPublicSpaceData endpoint to get the name of all spaces. Using the result from `getSpaces`
    didn't provide us with the name of spaces the user was a guest in.
    We're still able to get notifications from spaces in which the user only has guest access.
  */
  const publicSpaceResponse = await axios
    .post(
      notionURL + "/api/v3/getPublicSpaceData",
      {
        spaceIds: allSpaceIds,
        type: "space-ids",
      },
      { headers: { cookie: sessionData.cookie } }
    )
    .catch(({ response }) => {
      if (response?.status >= 400 && response?.status < 500) {
        handleNotionNotAuthorized();

        throw new Error(`getPublicSpaceData: ${response.status} - ${response.statusText}`);
      }
    });

  if (!publicSpaceResponse) {
    return;
  }

  const getPublicSpacesResult = GetPublicSpaceDataResult.parse(publicSpaceResponse.data);

  const allSpaces = getPublicSpacesResult.results.map(({ id, name }) => ({ id, name }));

  if (allSpaces.length === 0) {
    throw new Error(`Unable to find any spaces in account`);
  }

  const savedSpaces = notionAvailableSpacesValue.get();

  const hasNewSpaces = !allSpaces.every((synchedSpace) =>
    savedSpaces.spaces.some((savedSpace) => savedSpace.id === synchedSpace.id)
  );

  if (hasNewSpaces) {
    notionAvailableSpacesValue.set({ spaces: allSpaces });
  }
}

export function extractNotifications(
  payload: NonNullable<Awaited<ReturnType<typeof fetchNotionNotificationLog>>>
): NotionWorkerSync {
  const { notificationIds, recordMap } = payload;

  const result: NotionWorkerSync = [];

  log.debug(`Found ${notificationIds.length} notifications`);
  for (const id of notificationIds) {
    try {
      const notification = recordMap.notification?.[id].value;

      if (!notification) {
        log.error(new Error("Notification not found"), `Notification ${id} not found`);
        continue;
      }

      const notificationProperties = getNotificationProperties(notification, recordMap);
      if (!notificationProperties) {
        if (!isKnownAndUnsupported(notification, recordMap)) {
          log.error(`Unable to handle notification ${id} of type ${notification.type}:`, recordMap);
        }

        continue;
      }

      const { url, type, text_preview } = notificationProperties;

      try {
        new URL(url);
      } catch (e) {
        log.error(new Error("Invalid URL: " + url));
        continue;
      }

      const activityValue = recordMap.activity?.[notification.activity_id]?.value;

      // Weird bug where activity is undefined for a user
      // https://sentry.io/organizations/acapela/issues/3114653912/
      if (!activityValue) {
        log.error(
          new Error(
            `No activities found for notification ${JSON.stringify(notification)} with acitivities ${JSON.stringify(
              recordMap.activity
            )}`
          )
        );
        continue;
      }

      const activity = ActivityValueCommon.parse(activityValue);

      const createdAtTimestampAsNumber = Number.parseInt(notification.end_time);

      const created_at = new Date(createdAtTimestampAsNumber).toISOString();

      const page_title = getPageTitle(notification, recordMap);

      if (!page_title) {
        log.error(`Page title not found for notification_id ${notification.id}`, recordMap);
        continue;
      }

      const updated_at = created_at;

      const authorId = activity.edits?.[0]?.authors?.[0]?.id ?? "Notion";
      if (authorId === "Notion") {
        log.error("unable to extract authorId from activity" + JSON.stringify(activity, null, 2));
      }

      if (!notification.navigable_block_id) {
        log.error("no navigable_block_id in notification " + JSON.stringify(notification, null, 2));
        continue;
      }

      result.push({
        notification: {
          url,
          text_preview,
          created_at,
          updated_at,
          from: recordMap?.notion_user?.[authorId]?.value?.name ?? "Notion",
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
    } catch (error) {
      // We do not want a single mis-shaped notification to tear down the whole sync.
      // So we just log the error and move on to the next notification.
      log.error(error);
    }
  }

  return result;
}

function getPageTitle(
  notification: z.infer<typeof Notification>,
  recordMap: z.infer<typeof RecordMap>
): string | undefined {
  const blockId = notification.navigable_block_id;
  if (!blockId) {
    return;
  }
  const blockValue = recordMap?.block?.[blockId]?.value;

  const pageBlockResult = SomeBlockValue.safeParse(blockValue);
  if (pageBlockResult.success) {
    const [titleElement] = pageBlockResult.data.properties.title;
    return Array.isArray(titleElement) && typeof titleElement[0] == "string" ? titleElement[0] : "Untitled";
  }

  const collectionPageBlockResult = CollectionViewPageBlockValue.safeParse(blockValue);
  if (collectionPageBlockResult.success) {
    const block = collectionPageBlockResult.data;
    const collection = recordMap.collection && recordMap.collection[block.collection_id].value;
    if (!collection) {
      log.error(
        `Collection not found for notification_id ${notification.id} block.collection_id: ${block.collection_id}`,
        recordMap
      );
      return;
    }

    const name = collection?.name?.flat()[0];
    return typeof name === "string" ? name : "Untitled";
  }
}

function getNotificationProperties(
  notification: z.infer<typeof Notification>,
  recordMap: z.infer<typeof RecordMap>
):
  | { type: NotionNotificationType; url: string; text_preview?: string | undefined; discussion_id?: string | undefined }
  | undefined {
  const pageId = notification.navigable_block_id;

  if (!pageId) {
    return;
  }

  const activityValue = recordMap.activity?.[notification.activity_id].value;

  function logMissingActivity() {
    log.error(
      new Error(
        "Missing activity value for notification " +
          JSON.stringify({ notification, activities: recordMap.activity }, null, 2)
      )
    );
  }

  if (notification.type === "user-mentioned") {
    if (!activityValue) {
      logMissingActivity();
      return;
    }
    const activity = UserMentionedActivityValue.parse(activityValue);
    const url =
      notionURL +
      "/" +
      stripDashes(pageId) +
      (activity?.mentioned_block_id && pageId !== activity.mentioned_block_id
        ? `#${stripDashes(activity.mentioned_block_id)}`
        : "");

    return {
      type: "notification_notion_user_mentioned",
      url,
      text_preview: extractBlockMention(activity, recordMap),
    };
  }

  if (notification.type === "commented") {
    const activityResult = CommentedActivityValue.safeParse(activityValue);
    if (activityResult.success) {
      const activity = activityResult.data;
      const discussion = recordMap.discussion?.[activity.discussion_id].value;

      if (discussion) {
        const parentDiscussionBlock = discussion.parent_id;
        const url =
          notionURL +
          "/" +
          stripDashes(pageId) +
          "?d=" +
          `${stripDashes(discussion.id)}` +
          (parentDiscussionBlock ? `#${stripDashes(parentDiscussionBlock)}` : "");
        return {
          type: "notification_notion_commented",
          url,
          text_preview: extractNotionComment(activity, recordMap),
          discussion_id: activity.discussion_id,
        };
      } else {
        log.error(
          new Error(
            `Discussion with id ${activity.discussion_id} not found in recordMap: ${JSON.stringify(recordMap, null, 2)}`
          )
        );
      }
    }

    log.error(
      new Error(
        `Could not extract comment text and link for notification ${JSON.stringify(
          notification,
          null,
          2
        )} with records ${JSON.stringify(recordMap, null, 2)}`
      )
    );

    return {
      type: "notification_notion_commented",
      url: notionURL + "/" + stripDashes(pageId),
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

function isKnownAndUnsupported(
  notification: z.infer<typeof Notification>,
  recordMap: z.infer<typeof RecordMap>
): boolean {
  if (notification.type === "user-invited") {
    const activity = UserInvitedActivityValue.parse(recordMap.activity?.[notification.activity_id]?.value);
    if (activity?.parent_table === "space") {
      return true;
    }
  }

  return notification.type === "reminder";
}
