import { BrowserWindow } from "electron";
import fetch from "node-fetch";
import WebSocket from "ws";

import { FigmaWorkerSync, figmaSyncPayload } from "@aca/desktop/bridge/apps/figma";
import { authTokenBridgeValue, figmaAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { figmaURL } from "@aca/desktop/electron/auth/figma";
import { assert } from "@aca/shared/assert";

import {
  FigmaCommentNotification,
  FigmaSessionState,
  FigmaSocketMessage,
  FigmaUserNotification,
  GetFigmaUserNotificationsResponse,
} from "./types";

interface FigmaSessionData {
  cookie: string;
  release_git_tag: string;
  figmaUserId: string;
}

function isUserNotification(payload: FigmaUserNotification | undefined): payload is FigmaUserNotification {
  return payload !== undefined;
}

function isCommentNotification(payload: FigmaCommentNotification | unknown): payload is FigmaCommentNotification {
  return payload !== undefined && (payload as FigmaCommentNotification).comment !== undefined;
}

export function isFigmaReadyToSync() {
  return authTokenBridgeValue.get() !== null && figmaAuthTokenBridgeValue.get() !== null;
}
export async function startFigmaSync() {
  let figmaSessionData;
  console.info("[Figma] Fetching session variables");
  try {
    figmaSessionData = await getFigmaSessionData();
  } catch (e) {
    console.info("[Figma] Error getting figma session data", e);
    figmaAuthTokenBridgeValue.set(null);
    return;
  }
  console.info("[Figma] Done fetching session variables");
  // First sync happens as the app may be closed over night
  // This sync will get and sync all unread notifications since last app open
  getInitialFigmaSync(figmaSessionData);

  // The figma socket based sync will subscribe to user events
  // and sync every new notification as it comes in
  startFigmaSocketBasedSync(figmaSessionData);
}

async function getFigmaSessionData(): Promise<FigmaSessionData> {
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

  const figmaCookies = await figmaWindow.webContents.session.cookies.get({
    url: figmaURL,
  });

  figmaWindow.close();

  const cookie = figmaCookies
    .filter((cookie) => cookie.domain?.includes("figma.com"))
    .map((cookie) => cookie.name + "=" + cookie.value)
    .join("; ");

  assert(release_git_tag, "Cant find figma release tag");
  assert(figmaUserId, "Cant find figma user is");
  assert(cookie, "cant find figma cookie");

  return {
    release_git_tag,
    figmaUserId,
    cookie,
  };
}

async function getInitialFigmaSync({ cookie, figmaUserId }: FigmaSessionData) {
  console.info(`[Figma] Getting initial notifications`);

  const response = await fetch(figmaURL + "/api/user_notifications?current_org_id=&currentView=folder", {
    method: "GET",
    headers: {
      cookie,
    },
  });

  if (response.status === 401) {
    figmaAuthTokenBridgeValue.set(null);
    throw new Error("[Figma] Unauthorized");
  }

  const result: GetFigmaUserNotificationsResponse = await response.json();

  const unreadFigmaNotifications = result.meta.feed.filter((notification) => notification.read_at === null);

  console.info(`[Figma] Attempting to sync ${unreadFigmaNotifications.length} unread notifications`);

  // Initial sync only covers unread notifications
  transformAndSyncFigmaNotifications(unreadFigmaNotifications, figmaUserId);
}

async function startFigmaSocketBasedSync({ cookie, figmaUserId, release_git_tag }: FigmaSessionData) {
  // The realtime user token is used to establish a websocket subscription where we will get data
  // that included the user notification
  // It looks like this: "/me-979019639379984679:1643202911:0:2678f875be063e1ee888c7fa008c7b761fdf1241"
  let figmaRealtimeUserToken: string | null = null;

  try {
    const response = await fetch(figmaURL + "/api/user/state", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    figmaRealtimeUserToken = ((await response.json()) as FigmaSessionState).meta.user_realtime_token;
  } catch (e) {
    console.info(e);
    return;
  }

  if (!figmaRealtimeUserToken) {
    console.info("[Figma] unable to extract figma real time user token");
    return;
  }

  const ws = new WebSocket(`wss://www.figma.com/api/realtime_v2?release_git_tag=${release_git_tag}`, {
    perMessageDeflate: true,
    headers: {
      cookie,
    },
  });

  // Seems like figma uses pings to keep the connection open
  function startPingInterval() {
    setInterval(() => {
      ws.ping("ping");
      // 31/32 seconds is the ping interval seen in figma
    }, 31.5 * 1000);
  }

  ws.on("open", function open() {
    startPingInterval();

    // Subscription to messages related to user, including user notifications
    ws.send(`tok:${figmaRealtimeUserToken}`);
    console.info("[Figma] opening socket connection");
  });

  ws.on("message", function message(data) {
    // Many times we receive plain text responses, as indications that subscriptions have been successful and others
    // Otherwise we'll receive a message that resembles
    if (!data.toString().includes("method") || !data.toString().includes("type")) {
      return;
    }

    // Every other message received fits this structure
    const message = JSON.parse(data.toString("utf-8")) as FigmaSocketMessage;

    // We want to get newly created user notifications, that's why we're listing to "post" messages only
    if (
      message.method !== "post" ||
      message.type !== "user_notification" ||
      !isUserNotification(message.user_notification)
    ) {
      return;
    }

    console.info("[Figma] Received socket user notification");

    const userNotificationMessage: FigmaUserNotification = message.user_notification;

    transformAndSyncFigmaNotifications([userNotificationMessage], figmaUserId);
  });

  ws.on("error", (e) => console.info("[Figma] error", e));
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
      },
      commentNotification: {
        file_id: commentNotification.file_key,
        file_name: commentNotification.file.name,
        is_mention: commentNotification.comment.message_meta.some((meta) => meta.user_annotated?.id === figmaUserId),
        created_at: userNotification.created_at,
        updated_at: userNotification.created_at,
        figma_notification_id: userNotification.id,
      },
    });
  }

  if (syncPayload.length > 0) {
    figmaSyncPayload.send(syncPayload);
  }
}
