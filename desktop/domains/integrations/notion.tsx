import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { notionSelectedSpaceValue } from "@aca/desktop/bridge/apps/notion";
import { clearServiceCookiesBridge, loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { NotionSettings } from "./NotionSettings";
import { IntegrationClient } from "./types";

export const notionIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Notion",
  description: "Comments, mentions and page invitations.",
  getIsConnected: () => !!notionAuthTokenBridgeValue.get(),
  disconnect: async () => {
    notionAuthTokenBridgeValue.reset();
    notionSelectedSpaceValue.reset();
    await clearServiceCookiesBridge({ url: "https://www.notion.so" });
  },
  async connect() {
    await loginNotionBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.notion} />,

  additionalSettings: <NotionSettings />,
};
