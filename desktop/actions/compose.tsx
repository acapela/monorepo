import React from "react";

import { defineAction } from "@aca/desktop/actions/action";
import { getEnabledIntegrationClientList, getIntegrationAccountComposers } from "@aca/desktop/domains/integrations";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { IconArrowLeft, IconEdit } from "@aca/ui/icons";

export const exitComposeMode = defineAction({
  name: "Back",
  icon: <IconArrowLeft />,
  keywords: ["exit", "back"],
  shortcut: "Esc",
  canApply: () => getIsRouteActive("compose"),
  handler() {
    desktopRouter.goBack();
  },
});

export const goToComposeView = defineAction({
  name: (ctx) => {
    const integration = ctx.getTarget("integration", true);
    if (!integration) {
      return "Go to Compose";
    }
    const account = ctx.getTarget("account");
    return `Go to Compose in ${integration.name}${account ? " - " + account.name : ""}`;
  },
  icon(ctx) {
    const integration = ctx.getTarget("integration", true);
    return integration ? integration.icon : <IconEdit />;
  },
  handler(ctx) {
    const account = ctx.getTarget("account");
    const integration = ctx.getTarget("integration", true);
    const composeURLs = integration?.getComposeURLs?.();
    const url = composeURLs?.find(({ accountId }) => accountId == account?.id)?.url;
    if (url) {
      desktopRouter.navigate("compose", { url });
    } else {
      const clients = integration ? [integration] : getEnabledIntegrationClientList();
      return {
        getActions: () =>
          getIntegrationAccountComposers(clients).map(({ client, account, url }) =>
            defineAction({
              name: client.name,
              supplementaryLabel: account.name,
              icon: client.icon,
              handler() {
                desktopRouter.navigate("compose", { url });
              },
            })
          ),
      };
    }
  },
});
