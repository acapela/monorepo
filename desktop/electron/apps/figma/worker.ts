import { differenceInDays, differenceInMilliseconds, differenceInWeeks } from "date-fns";
import { BrowserWindow } from "electron";
import fetch from "node-fetch";

import { FigmaWorkerSync, figmaSyncPayload } from "@aca/desktop/bridge/apps/figma";
import { authTokenBridgeValue, figmaAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { clearFigmaSessionData, figmaURL } from "@aca/desktop/electron/auth/figma";

import { ServiceSyncController } from "../types";
import {
  FigmaCommentMessageMeta,
  FigmaCommentNotification,
  FigmaUserNotification,
  GetFigmaUserNotificationsResponse,
} from "./types";

interface FigmaSessionData {
  cookie: string;
  release_git_tag: string;
  figmaUserId: string;
  trackingSessionId: string;
}

const log = makeLogger("Figma-Worker");

function isCommentNotification(payload: FigmaCommentNotification | unknown): payload is FigmaCommentNotification {
  return payload !== undefined && (payload as FigmaCommentNotification).comment !== undefined;
}

export function isFigmaReadyToSync() {
  return authTokenBridgeValue.get() !== null && figmaAuthTokenBridgeValue.get() !== null;
}

const WINDOW_BLURRED_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes;
const WINDOW_FOCUSED_INTERVAL_MS = 90 * 1000; // 90 seconds;

let currentInterval: NodeJS.Timer | null = null;
let timeOfLastSync: Date | null = null;
let isSyncing = false;

export function startFigmaSync(): ServiceSyncController {
  async function runSync() {
    if (isSyncing) {
      return;
    }
    try {
      isSyncing = true;
      await captureLatestNotifications();
    } catch (e) {
      log.error(e);
    }

    isSyncing = false;

    timeOfLastSync = new Date();
  }

  function restartPullInterval(timeInterval: number) {
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    currentInterval = setInterval(captureLatestNotifications, timeInterval);
  }

  runSync();

  return {
    serviceName: "figma",
    onWindowFocus() {
      const now = new Date();
      const isLongTimeSinceLastFocus =
        !timeOfLastSync || differenceInMilliseconds(now, timeOfLastSync) > WINDOW_FOCUSED_INTERVAL_MS;

      if (isLongTimeSinceLastFocus) {
        runSync();
      }
      restartPullInterval(WINDOW_FOCUSED_INTERVAL_MS);
    },
    onWindowBlur() {
      restartPullInterval(WINDOW_BLURRED_INTERVAL_MS);
    },
    forceSync() {
      runSync();
    },
  };
}

async function captureLatestNotifications() {
  let figmaSessionData;
  log.info("Capturing started");
  try {
    figmaSessionData = await getFigmaSessionData();
  } catch (e) {
    log.error("Error getting figma session data," + JSON.stringify(e));
    clearFigmaSessionData();
    return;
  }
  log.info("Done fetching session variables");
  // First sync extract all of the notifications from a standard rest endpoint.
  // This sync will get and sync all relevant notifications since last app open
  // Relevant notification: !read && !resolved && !rejected && created less than 2 weeks ago
  await getInitialFigmaSync(figmaSessionData);
  log.info(`Capturing complete`);
}

export async function getFigmaSessionData(): Promise<FigmaSessionData> {
  const figmaWindow = new BrowserWindow({
    width: 0,
    height: 0,
  });

  figmaWindow.hide();

  await figmaWindow.webContents.loadURL(figmaURL);

  // This is used for version controlling the app with their api
  // We may need to keep a static version of this, but verify that their API is working every week
  const release_git_tag = await figmaWindow.webContents.executeJavaScript("window.INITIAL_OPTIONS.release_git_tag");

  const figmaUserId = await figmaWindow.webContents.executeJavaScript("window.INITIAL_OPTIONS.user_data.id");

  // This seems to be used for distributed tracing mechanisms (e.g. https://www.jaegertracing.io/)
  // Some apis don't work without this
  const trackingSessionId = await figmaWindow.webContents.executeJavaScript(
    "window.INITIAL_OPTIONS.tracking_session_id"
  );

  const figmaCookies = await figmaWindow.webContents.session.cookies.get({
    url: figmaURL,
  });

  figmaWindow.close();

  const cookie = figmaCookies
    .filter((cookie) => cookie.domain?.includes("figma.com"))
    .map((cookie) => cookie.name + "=" + cookie.value)
    .join("; ");

  log.assert(release_git_tag, "Cant find figma release tag");
  log.assert(figmaUserId, "Cant find figma user is");
  log.assert(trackingSessionId, "cant find tracking session id");
  log.assert(cookie, "cant find figma cookie");

  return {
    release_git_tag,
    figmaUserId,
    cookie,
    trackingSessionId,
  };
}

const isLessThan2WeeksOld = (isoString: string) => differenceInWeeks(new Date(), new Date(isoString)) < 2;
const isLessThan2DaysOld = (isoString: string) => differenceInDays(new Date(), new Date(isoString)) < 2;

async function getInitialFigmaSync({ cookie, figmaUserId }: FigmaSessionData) {
  log.info(`Getting initial notifications`);

  // WARNING!
  // Figma notifications are all marked as read whenever this api call is made
  const response = await fetch(figmaURL + "/api/user_notifications?current_org_id=&currentView=folder", {
    method: "GET",
    headers: {
      cookie,
    },
  });

  if (!response.ok) {
    clearFigmaSessionData();
    throw log.error(new Error(`user_notification -> ${response.status} ${response.statusText}`));
  }

  const result = (await response.json()) as GetFigmaUserNotificationsResponse;

  // This is the case of someone that goes on vacation and doesn't go into figma
  const isUnreadButLessThan2WeeksOld = ({ read_at, created_at }: FigmaUserNotification) =>
    !read_at && isLessThan2WeeksOld(created_at);

  // The `isLessThat2DaysOld` covers the corner case of people actively checking notifications in Figma app.
  // Since clicking on the notification bell marks all comments as unread, we only check if
  // the notification is very recent regardless if its read or not
  // We also don't want extremely old notifications to be synced. That's why we have a check to get
  // unread notifications that are more than 2 weeks old. This covers that case of someone going out on vacation
  // and getting back to see the recently actionable things they have to do
  const isNotificationRelevant = (n: FigmaUserNotification) =>
    !n.resolved_at && !n.rejected_at && (isLessThan2DaysOld(n.created_at) || isUnreadButLessThan2WeeksOld(n));

  const relevantFigmaNotifications = result.meta.feed.filter(isNotificationRelevant);

  log.info(`Attempting to sync ${relevantFigmaNotifications.length} relevant notifications`);

  transformAndSyncFigmaNotifications(relevantFigmaNotifications, figmaUserId);
}

function transformAndSyncFigmaNotifications(figmaUserNotifications: FigmaUserNotification[], figmaUserId: string) {
  const syncPayload: FigmaWorkerSync = [];

  for (const userNotification of figmaUserNotifications) {
    // We've seen notifications when a user gets different access permissions
    // We only want to handle new comments for now
    if (!isCommentNotification(userNotification.locals)) {
      continue;
    }

    const commentNotification: FigmaCommentNotification = userNotification.locals;

    syncPayload.push({
      notification: {
        created_at: userNotification.created_at,
        updated_at: userNotification.created_at,
        from: commentNotification.from.handle,
        url: commentNotification.reply_url,
        text_preview: getMessageText(commentNotification.comment.message_meta),
      },
      commentNotification: {
        author_id: commentNotification.user_id,
        file_id: commentNotification.file_key,
        file_name: commentNotification.file.name,
        is_mention: commentNotification.comment.message_meta.some((meta) => meta.user_annotated?.id === figmaUserId),
        created_at: userNotification.created_at,
        updated_at: userNotification.created_at,
        figma_notification_id: userNotification.id,
        thread_comment_id: commentNotification.parent_comment?.id,
      },
    });
  }

  if (syncPayload.length > 0) {
    figmaSyncPayload.send(syncPayload);
  }
}

function getMessageText(commentParts: FigmaCommentMessageMeta[]): string {
  let result = "";

  for (const commentPart of commentParts) {
    if (commentPart.user_annotated) {
      result += `@${commentPart.user_annotated.handle} `;
    } else {
      result += `${commentPart.t} `;
    }
  }

  return result;
}
