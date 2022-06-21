import { isString, uniq } from "lodash";
import React from "react";

import { trackEvent } from "@aca/desktop/analytics";
import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { notionAvailableSpacesValue, notionSelectedSpaceValue } from "@aca/desktop/bridge/apps/notion";
import { clearServiceCookiesBridge, loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { getDb, getNullableDb } from "@aca/desktop/clientdb";

import { NotionSettings } from "./NotionSettings";
import { IntegrationClient } from "./types";

// Apparently this works only with 1 backslash
const NOTION_URL_SCHEME = "notion:/";

const notionURL = "https://www.notion.so";

export const notionIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_notion",
  name: "Notion",
  description: "Comments, mentions and page invitations.",
  getIsConnected: () => !!notionAuthTokenBridgeValue.get(),
  getCanConnect: () => !notionAuthTokenBridgeValue.get(),
  getAccounts: () => (notionAuthTokenBridgeValue.get() ? [{ kind: "account", id: "notion", name: "Notion" }] : []),
  getWorkspaces: () => {
    const db = getNullableDb();

    if (!db) return [];

    const notificationWithWorkspaces = db.notificationNotion.all.map((n) => n.workspaceName).filter(isString);
    return uniq(notificationWithWorkspaces);
  },
  convertToLocalAppUrl: async ({ url }) => {
    return {
      protocol: "notion",
      localUrl: url.replace(`${notionURL}/`, NOTION_URL_SCHEME),
      fallback: url,
    };
  },
  disconnect: async () => {
    notionAuthTokenBridgeValue.reset();
    notionSelectedSpaceValue.reset();
    notionAvailableSpacesValue.reset();
    const db = getDb();
    db.notionSpaceUser.all.forEach((nsu) => nsu.remove());
    await clearServiceCookiesBridge({ url: notionURL });
  },
  async connect() {
    await loginNotionBridge();
    trackEvent("Notion Integration Added");
    trackEvent("New Integration Added", { integration: "notion" });
  },

  requiresReconnection() {
    if (notionIntegrationClient.getIsConnected()) {
      return false;
    }

    const hasReceivedNotionNotifications = !!getNullableDb()?.notificationNotion.hasItems;
    return hasReceivedNotionNotifications;
  },
  imageURL: integrationLogos.notion,

  additionalSettings: <NotionSettings />,
};
