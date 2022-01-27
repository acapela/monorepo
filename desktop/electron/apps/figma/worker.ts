import { BrowserWindow } from "electron";
import fetch from "node-fetch";
import WebSocket from "ws";

import { figmaSyncPayload } from "@aca/desktop/bridge/apps/figma";
import { figmaURL } from "@aca/desktop/electron/auth/figma";

import { FigmaCommentNotification, FigmaSessionState, FigmaSocketMessage, FigmaUserNotificationMessage } from "./types";

// This is used for version controlling the app with their api
// We may need to keep a static version of this, but verify that their API is working every week
let release_git_tag: string | null = null;
let figmaUserId: string | null = null;

// The realtime user token is used to establish a websocket subscription where we will get data
// that included the user notification
// It looks like this: "/me-979019639379984679:1643202911:0:2678f875be063e1ee888c7fa008c7b761fdf1241"
let figmaRealtimeUserToken: string | null = null;

export async function testFigma() {
  const figmaWindow = new BrowserWindow({
    width: 0,
    height: 0,
  });

  figmaWindow.hide();

  await figmaWindow.webContents.loadURL(figmaURL);

  release_git_tag = await figmaWindow.webContents.executeJavaScript("window.INITIAL_OPTIONS.release_git_tag");
  figmaUserId = await figmaWindow.webContents.executeJavaScript("window.INITIAL_OPTIONS.user_data.id");

  figmaWindow.close();

  const figmaCookies = await figmaWindow.webContents.session.cookies.get({
    url: figmaURL,
  });
  const cookie = figmaCookies
    .filter((cookie) => cookie.domain?.includes("figma.com"))
    .map((cookie) => cookie.name + "=" + cookie.value)
    .join("; ");

  try {
    const response = await fetch(figmaURL + "/api/user/state", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    figmaRealtimeUserToken = ((await response.json()) as FigmaSessionState).meta.user_realtime_token;
  } catch (e) {
    console.error(e);
  }

  if (!figmaRealtimeUserToken) {
    console.error("unable to extract figma real time user token");
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
    console.info("[Figma] opening socket connection open");
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

    const userNotificationMessage: FigmaUserNotificationMessage = message.user_notification;

    // We've seen notifications when a user gets different access permissions
    // We only want to handle new comments for now
    if (!isCommentNotification(userNotificationMessage.locals)) {
      return;
    }

    const commentNotification: FigmaCommentNotification = userNotificationMessage.locals;

    console.info("[Figma] Received socket message");

    figmaSyncPayload.send([
      {
        notification: {
          created_at: userNotificationMessage.created_at,
          updated_at: userNotificationMessage.created_at,
          from: commentNotification.from.handle,
          url: commentNotification.reply_url,
        },
        commentNotification: {
          file_id: commentNotification.file_key,
          file_name: commentNotification.file.name,
          is_mention: commentNotification.comment.message_meta.some((meta) => meta.user_annotated?.id === figmaUserId),
          created_at: userNotificationMessage.created_at,
          updated_at: userNotificationMessage.created_at,
          figma_notification_id: userNotificationMessage.id,
        },
      },
    ]);
  });

  ws.on("error", (e) => console.info("error", e));

  ws.on("pong", (d) => console.info("pong received", d.toString("utf-8")));
}

function isUserNotification(
  payload: FigmaUserNotificationMessage | undefined
): payload is FigmaUserNotificationMessage {
  return payload !== undefined;
}

function isCommentNotification(payload: FigmaCommentNotification | unknown): payload is FigmaCommentNotification {
  return payload !== undefined && (payload as FigmaCommentNotification).comment !== undefined;
}
