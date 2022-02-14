import { autorun, makeAutoObservable } from "mobx";

import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";

import { integrationClients } from "../domains/integrations";

/**
 * Store responsible for keeping information about current onboarding.
 */

export const onboardingStore = makeAutoObservable({
  get isReady() {
    return authTokenBridgeValue.observables.isReady;
  },

  get hasLinkedApps(): boolean {
    return Object.values(integrationClients).some((ic) => ic.getIsConnected());
  },

  onboardingStatus: "unknown" as "unknown" | "ongoing" | "complete",
});

autorun(() => {
  const { isReady, onboardingStatus, hasLinkedApps } = onboardingStore;

  if (isReady && !hasLinkedApps && onboardingStatus === "unknown") {
    onboardingStore.onboardingStatus = "ongoing";
  }
});
