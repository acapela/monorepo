import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { NotionSettings } from "./NotionSettings";
import { IntegrationClient } from "./types";

export const notionIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Notion",
  description: "Comments, mentions and page invitations.",
  getIsConnected: () => !!notionAuthTokenBridgeValue.get(),
  async connect() {
    await loginNotionBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.notion} />,

  additionalSettings: <NotionSettings />,
};
