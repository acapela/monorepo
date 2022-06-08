import { makeAutoObservable } from "mobx";

import { integrationClients } from "@aca/desktop/domains/integrations";

/**
 * Store responsible for keeping information about current onboarding.
 */
const clients = Object.values(integrationClients);

// Acapela treated as an app
const AMOUNT_OF_ALWAYS_CONNECTED_APPS = 1;

export const onboardingStore = makeAutoObservable({
  get hasLinkedApps() {
    const amountOfConnectedApps = clients.filter((ic) => ic.getAccounts().length > 0).length;
    return amountOfConnectedApps > AMOUNT_OF_ALWAYS_CONNECTED_APPS;
  },
});
