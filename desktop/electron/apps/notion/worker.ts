import axios from "axios";
import { session } from "electron";

import {
  notionAvailableSpacesValue,
  notionSelectedSpaceValue,
  notionSyncPayload,
} from "@aca/desktop/bridge/apps/notion";
import { authTokenBridgeValue, loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { addToast } from "@aca/desktop/domains/toasts/store";
import {
  KnownSyncError,
  ServiceSyncController,
  makeServiceSyncController,
} from "@aca/desktop/electron/apps/serviceSyncController";
import { clearNotionSessionData, notionURL } from "@aca/desktop/electron/auth/notion";
import { assert } from "@aca/shared/assert";
import { wait } from "@aca/shared/time";

import { extractNotifications } from "./notificationExtractor";
import { GetNotificationLogResult, GetPublicSpaceDataResult, GetSpacesResult } from "./schema";
import { workerLog as log } from "./utils";

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
    isInfinite: true,
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
  return makeServiceSyncController("notion", notionURL, runSync);
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
        const msg = `getNotificationLog ${response.status} - ${response.statusText}`;

        if (response.status === 401) {
          handleNotionNotAuthorized();
          throw new KnownSyncError(msg);
        }
        throw new Error(msg);
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
        const msg = `getSpaces: ${response.status} - ${response.statusText}`;

        if (response.status === 401) {
          handleNotionNotAuthorized();
          throw new KnownSyncError(msg);
        }
        throw new Error(msg);
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
        const msg = `getPublicSpaceData: ${response.status} - ${response.statusText}`;
        if (response.status === 401) {
          handleNotionNotAuthorized();
          throw new KnownSyncError(msg);
        }
        throw new Error(msg);
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
