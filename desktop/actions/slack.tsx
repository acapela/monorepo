import React from "react";

import { getNullableDb } from "@aca/desktop/clientdb";
import { authStore } from "@aca/desktop/store/authStore";
import { assertDefined } from "@aca/shared/assert";
import { IconPlus, IconToggleOff, IconToggleOn } from "@aca/ui/icons";

import { integrationClients } from "../domains/integrations";
import { defineAction } from "./action";
import { accountActionsGroup, getContextualServiceName } from "./auth";

const getAuthUser = () => getNullableDb()?.user.findById(authStore.user.id) ?? null;

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

const getIsAutoResolveEnabled = () => Boolean(getAuthUser()?.is_slack_auto_resolve_enabled);

export const toggleSlackAutoResolve = defineAction({
  name: () => (getIsAutoResolveEnabled() ? "Disable Slack Auto Resolve" : "Enable Slack Auto Resolve"),
  group: accountActionsGroup,
  icon: () => (getIsAutoResolveEnabled() ? <IconToggleOn /> : <IconToggleOff />),
  canApply: () => Boolean(getAuthUser()?.has_slack_installation),
  handler() {
    const user = assertDefined(getAuthUser(), "missing user");
    user.update({ is_slack_auto_resolve_enabled: !user.is_slack_auto_resolve_enabled });
  },
});
