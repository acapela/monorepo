import React from "react";

import { assertDefined } from "@aca/shared/assert";
import { IconPlus, IconToggleOff, IconToggleOn } from "@aca/ui/icons";

import { integrationClients } from "../domains/integrations";
import { accountStore } from "../store/account";
import { defineAction } from "./action";
import { accountActionsGroup, getContextualServiceName } from "./auth";

export const connectSlack = defineAction({
  name: getContextualServiceName("Slack"),
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
  canApply: () => Boolean(accountStore.user?.has_slack_installation),
  handler() {
    const user = assertDefined(accountStore.user, "missing user");
    user.update({ is_slack_auto_resolve_enabled: !user.is_slack_auto_resolve_enabled });
  },
});
