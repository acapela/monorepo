import { makeAutoObservable } from "mobx";

import { integrationClients } from "@aca/desktop/domains/integrations";

/**
 * Store responsible for keeping information about current onboarding.
 */
const clients = Object.values(integrationClients);

export const onboardingStore = makeAutoObservable({
  get hasLinkedApps() {
    return clients.some((ic) => ic.getAccounts().length > 0);
  },
});
