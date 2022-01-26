import { BrowserWindow } from "electron";
import fetch from "node-fetch";
import WebSocket from "ws";

/* eslint-disable no-console */
import { figmaURL } from "@aca/desktop/electron/auth/figma";

// This is used for version controlling the app with their api
// We may need to keep a static version of this, but verify that their API is working every week
let release_git_tag: string | null = null;
let figmaUserId: string | null = null;

// The realtime user token is used to establish a websocket subscription where we will get data
// that included the user notification
// It looks like this: "/me-979019639379984679:1643202911:0:2678f875be063e1ee888c7fa008c7b761fdf1241"
let figmaRealtimeUserToken: string | null = null;

// WIP: proof of concept that figma can work with web sockets;
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
    console.log(e);
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

  ws.on("open", function open() {
    // TODO: Ping every 31 seconds
    ws.ping("ping");

    // Subscription to messages related to user, including user notifications
    ws.send(`tok:${figmaRealtimeUserToken}`);
  });

  ws.on("message", function message(data) {
    // Many times we receive plain text responses, as indications that subscriptions have been successful and others
    // Otherwise we'll receive a message that resembles
    if (!data.toString().includes("method") || !data.toString().includes("type")) {
      return;
    }

    const message = JSON.parse(data.toString("utf-8")) as FigmaSocketMessage;

    if (
      message.method !== "post" ||
      message.type !== "user_notification" ||
      !isUserNotification(message.user_notification)
    ) {
      return;
    }

    const userNotificationMessage: FigmaUserNotificationMessage = message.user_notification;

    console.log({ userNotificationMessage });

    if (!isCommentNotification(userNotificationMessage.locals)) {
      return;
    }

    const commentNotification: FigmaCommentNotification = userNotificationMessage.locals;

    console.log({ commentNotification });

    console.log({
      from: commentNotification.from.handle,
      file_id: commentNotification.file_key,
      file_name: commentNotification.file.name,
      is_mention: commentNotification.comment.message_meta.some((meta) => meta.user_annotated?.id === figmaUserId),
      created_at: userNotificationMessage.created_at,
      url: commentNotification.reply_url,
    });
  });

  ws.on("error", (e) => console.log("error", e));

  ws.on("pong", (d) => console.log("pong received", d.toString("utf-8")));
}

function isUserNotification(
  payload: FigmaUserNotificationMessage | undefined
): payload is FigmaUserNotificationMessage {
  return payload !== undefined;
}

function isCommentNotification(payload: FigmaCommentNotification | unknown): payload is FigmaCommentNotification {
  return payload !== undefined && (payload as FigmaCommentNotification).comment !== undefined;
}

//tok:/profile-979019639463365631:1643202911:0:2344cb7182efd26138144afb9dfc0fba6fd0ff46
//user_realtime_token: "/me-979019639379984679:1643202911:0:2678f875be063e1ee888c7fa008c7b761fdf1241"

interface FigmaSessionState {
  error: boolean;
  status: number;
  meta: {
    user_realtime_token: string;
  };
}

interface FigmaSocketMessage {
  method: "post" | "put" | unknown;
  type: "user_notification" | unknown;
  parent_org_id: unknown;
  user_notification?: FigmaUserNotificationMessage;
}

interface FigmaUserNotificationMessage {
  id: string;
  user_id: string;
  view: number;
  locals: FigmaCommentNotification | unknown;
  read_at: string | null; //date iso string
  created_at: string | null; //date iso string
  resolved_at: string | null; //date iso string
  rejected_at: string | null; //date iso string
  community_profile_id: unknown;
  space_id: unknown;
  cursor_id: unknown;
  parent_org_id: unknown;
}

interface FigmaUser {
  id: string;
  handle: string; // name of user, e.g. Clark Kent
  img_url: string;
}

interface FigmaCommentMessageMeta {
  user_id?: string;
  user_annotated?: FigmaUser;
  t: string; //message text payload
}

interface FigmaComment {
  id: string;
  message_meta: FigmaCommentMessageMeta[];
  user: FigmaUser;
}

interface FigmaFile {
  key: string;
  name: string; //title of file
  folder_id: string | null;
  team_id: string | null;
  thumbnail_url: string | null;
}

interface FigmaCommentNotification {
  file_key: string; //a-zA-Z0-9 value
  parent_org_id: unknown;
  comment_id: string;
  comment_parent_id: string | null;
  thumbnail_url: string;
  thumbnail_status: unknown; //
  user_id: string; //from user_id
  from: FigmaUser;
  prototype: boolean;
  comment: FigmaComment;
  open_url: string;
  reply_url: string;
  parent_comment: FigmaComment | null;
  file: FigmaFile;
}
