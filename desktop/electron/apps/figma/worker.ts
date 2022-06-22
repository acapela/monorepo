import axios, { AxiosResponse } from "axios";
import { differenceInDays, differenceInWeeks } from "date-fns";

import { FigmaWorkerSync, figmaSyncPayload } from "@aca/desktop/bridge/apps/figma";
import { authTokenBridgeValue, figmaAuthTokenBridgeValue, loginFigmaBridge } from "@aca/desktop/bridge/auth";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { FigmaSessionData, clearFigmaSessionData, figmaURL } from "@aca/desktop/electron/auth/figma";
import { LogAttachment } from "@aca/shared/debug/logAttachment.types";

import { KnownSyncError, ServiceSyncController, makeServiceSyncController } from "../serviceSyncController";
import {
  FigmaCommentMessageMeta,
  FigmaCommentNotification,
  FigmaUserNotification,
  GetFigmaUserNotificationsResponse,
} from "./types";

const log = makeLogger("Figma-Worker");

function isCommentNotification(payload: FigmaCommentNotification | unknown): payload is FigmaCommentNotification {
  return payload !== undefined && (payload as FigmaCommentNotification).comment !== undefined;
}

function handleFigmaNotAuthorized() {
  addToast({
    title: "Figma Sync Stopped",
    message: "Please reconnect to restart sync",
    isInfinite: true,
    action: {
      label: "Reconnect",
      callback: () => loginFigmaBridge(),
    },
  });
  clearFigmaSessionData();
}

export function isFigmaReadyToSync() {
  return authTokenBridgeValue.get() !== null && figmaAuthTokenBridgeValue.get() !== null;
}

export function startFigmaSync(): ServiceSyncController {
  return makeServiceSyncController("figma", figmaURL, async () => await captureLatestNotifications());
}

async function captureLatestNotifications() {
  const figmaSessionData = await figmaAuthTokenBridgeValue.get();

  if (!figmaSessionData) {
    log.info("no session data - stopping sync");
    return;
  }

  // First sync extract all of the notifications from a standard rest endpoint.
  // This sync will get and sync all relevant notifications since last app open
  // Relevant notification: !read && !resolved && !rejected && created less than 2 weeks ago
  await getInitialFigmaSync(figmaSessionData);
}

const isLessThan2WeeksOld = (isoString: string) => differenceInWeeks(new Date(), new Date(isoString)) < 2;
const isLessThan2DaysOld = (isoString: string) => differenceInDays(new Date(), new Date(isoString)) < 2;

async function getInitialFigmaSync({ cookie, figmaUserId }: FigmaSessionData) {
  log.info(`Getting initial notifications`);

  // WARNING!
  // Figma notifications are all marked as read whenever this api call is made
  let response: AxiosResponse;
  try {
    response = await axios.get(figmaURL + "/api/user_notifications?current_org_id=&currentView=folder", {
      headers: { cookie },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const response = error.response as AxiosResponse | undefined;
    if (response) {
      const msg = `user_notification -> ${response.status} ${response.statusText}`;
      if (response.status >= 400 && response.status < 500) {
        if (response.status === 401) {
          handleFigmaNotAuthorized();
          throw new KnownSyncError(msg);
        }
      }
      throw new Error(msg);
    }

    throw error;
  }

  const result = response.data as GetFigmaUserNotificationsResponse;

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
      log.error("Unhandled notification", {
        body: JSON.stringify(userNotification),
        fileName: "figma-notification.txt",
        type: "plain/text",
      } as LogAttachment);
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
