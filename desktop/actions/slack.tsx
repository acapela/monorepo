import React from "react";

import { ActionContext } from "@aca/desktop/actions/action/context";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { accountStore } from "@aca/desktop/store/account";
import { assertDefined } from "@aca/shared/assert";
import { IconPlus, IconToggleOff, IconToggleOn } from "@aca/ui/icons";

import { defineAction } from "./action";
import { accountActionsGroup } from "./auth";

export const connectSlack = defineAction({
  name: (ctx: ActionContext) => {
    const slackInstallation = accountStore.user?.slackInstallation;
    const isReconnect = Boolean(slackInstallation && !slackInstallation.hasAllScopes);
    const actionName = isReconnect ? "Reconnect" : "Connect";
    return ctx.isContextual ? actionName : `${actionName} Slack`;
  },
  icon: <IconPlus />,
  group: accountActionsGroup,
  canApply: () => {
    return !integrationClients.slack.getIsConnected();
  },
  handler() {
    return integrationClients.slack.connect();
  },
});

const getIsAutoResolveEnabled = () => Boolean(accountStore.user?.is_slack_auto_resolve_enabled);

export const toggleSlackAutoResolve = defineAction({
  name: () => (getIsAutoResolveEnabled() ? "Disable Slack Auto Resolve" : "Enable Slack Auto Resolve"),
  group: accountActionsGroup,
  icon: () => (getIsAutoResolveEnabled() ? <IconToggleOn /> : <IconToggleOff />),
  canApply: () => Boolean(accountStore.user?.slackInstallation),
  handler() {
    const user = assertDefined(accountStore.user, "missing user");
    user.update({ is_slack_auto_resolve_enabled: !user.is_slack_auto_resolve_enabled });
  },
});
