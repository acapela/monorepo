import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { getIsAppInstalledLocally } from "@aca/desktop/bridge/apps";
import { notionSelectedSpaceValue } from "@aca/desktop/bridge/apps/notion";
import { clearServiceCookiesBridge, loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { NotionSettings } from "./NotionSettings";
import { IntegrationClient } from "./types";

// Apparently this works only with 1 backslach
const NOTION_URL_SCHEME = "notion:/";

const notionURL = "https://www.notion.so";

export const notionIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Notion",
  description: "Comments, mentions and page invitations.",
  getIsConnected: () => !!notionAuthTokenBridgeValue.get(),
  convertToLocalAppUrl: async (url) => {
    const isAppInstalledLocally = await getIsAppInstalledLocally(NOTION_URL_SCHEME);
    if (isAppInstalledLocally) {
      return url.replace(`${notionURL}/`, `${NOTION_URL_SCHEME}`);
    }
    return url;
  },
  disconnect: async () => {
    notionAuthTokenBridgeValue.reset();
    notionSelectedSpaceValue.reset();
    await clearServiceCookiesBridge({ url: notionURL });
  },
  async connect() {
    await loginNotionBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.notion} />,

  additionalSettings: <NotionSettings />,
};
