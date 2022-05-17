import { action, computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import semver from "semver";

import { getNullableDb } from "../clientdb";
import { AlertEntity } from "../clientdb/alert";
import { integrationClients } from "../domains/integrations";
import { addToast } from "../domains/toasts/store";
import { accountStore } from "../store/account";

function filterAlertsForCurrentVersion(alerts: AlertEntity[]) {
  return alerts.filter((alert) =>
    semver.satisfies(window.electronBridge.env.version, alert.app_version_range as string)
  );
}

function filterAlertsForConnectedIntegrations(alerts: AlertEntity[]) {
  const connectedIntegrations = Object.values(integrationClients)
    .filter((ic) => ic.getIsConnected())
    .map((ic) => ic.notificationTypename);

  return alerts.filter((alert) =>
    connectedIntegrations.some((connectedIntegration) => alert.connected_integrations.includes(connectedIntegration))
  );
}

export const BackendAlerts = observer(function BackendAlerts() {
  const db = getNullableDb();
  const { user } = accountStore;

  if (!db || !user) {
    console.error("not loaded");
    return <></>;
  }

  const alert = computed(() => {
    const unreadAlert = db.alert.query((a) => !a.isRead);

    const allAlerts = unreadAlert.query((a) => !a.expires_at || new Date(a.expires_at).getTime() > Date.now());

    const directAlerts = allAlerts.query({ user_id: user.id }).all;

    const appVersionAlerts = filterAlertsForCurrentVersion(allAlerts.query((a) => !!a.app_version_range).all);

    const connectedIntegrationAlerts = filterAlertsForConnectedIntegrations(
      allAlerts.query((a) => !!a.connected_integrations).all
    );

    return [...directAlerts, ...appVersionAlerts, ...connectedIntegrationAlerts][0];
  }).get();

  if (alert) {
    addToast({
      title: alert.title as string | undefined,
      message: alert.body,
      key: alert.id,
      isInfinite: true,
    });

    // TODO: Make this work with toast.onDismiss
    action(() => {
      db.alertReadReceipt.create({
        alert_id: alert.id,
        user_id: user.id,
      });
    });
  }

  return <></>;
});
