import { autorun, makeAutoObservable } from "mobx";

import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { integrationClients } from "@aca/desktop/domains/integrations";

/**
 * Store responsible for keeping information about current onboarding.
 */
const clients = Object.values(integrationClients);

export const onboardingStore = makeAutoObservable({
  get isReady() {
    return authTokenBridgeValue.observables.isReady && clients.every((client) => client.isReady.get());
  },

  get hasLinkedApps() {
    return clients.some((ic) => ic.getConnections().length > 0);
  },

  onboardingStatus: "unknown" as "unknown" | "ongoing" | "complete",
});

autorun(() => {
  const { isReady, onboardingStatus, hasLinkedApps } = onboardingStore;

  if (isReady && !hasLinkedApps && onboardingStatus === "unknown") {
    onboardingStore.onboardingStatus = "ongoing";
  }
});
