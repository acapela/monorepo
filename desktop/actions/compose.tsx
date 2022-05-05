import React from "react";

import { defineAction } from "@aca/desktop/actions/action";
import { trackEvent } from "@aca/desktop/analytics";
import { getIntegrationAccountComposers } from "@aca/desktop/domains/integrations";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { IconArrowLeft, IconEdit } from "@aca/ui/icons";

export const exitComposeMode = defineAction({
  name: "Exit compose",
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
    const integrationWithAccount = ctx.getTarget("integrationWithAccount");
    if (!integrationWithAccount) {
      return "Go to Compose";
    }
    const { integration, account } = integrationWithAccount;
    return `Go to Compose in ${integration.name} - ${account.name}`;
  },
  icon(ctx) {
    const integrationWithAccount = ctx.getTarget("integrationWithAccount");
    if (integrationWithAccount) {
      const { integration, account } = integrationWithAccount;
      return <IntegrationIcon integrationClient={integration} account={account} />;
    } else {
      return <IconEdit />;
    }
  },
  handler(ctx) {
    const integrationWithAccount = ctx.getTarget("integrationWithAccount");

    if (integrationWithAccount) {
      const { integration, account } = integrationWithAccount;
      const composeURLs = integration?.getComposeURLs?.();
      const url = composeURLs?.find(({ accountId }) => accountId == account?.id)?.url;
      if (url) {
        desktopRouter.navigate("compose", { url });
        trackEvent("New Message Composed", { integration: integration.name });
        return;
      }
    }

    return {
      getActions: () =>
        getIntegrationAccountComposers().map(({ client, account, url }) =>
          defineAction({
            name: client.name,
            supplementaryLabel: account.name,
            icon: <IntegrationIcon integrationClient={client} account={account} />,
            handler() {
              desktopRouter.navigate("compose", { url });
              trackEvent("New Message Composed", { integration: client.name });
            },
          })
        ),
    };
  },
});
