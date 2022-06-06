import { computed, runInAction } from "mobx";

import { createMobxPersistedStore } from "@aca/shared/mobx/persistedStore";

export const onboardingStateStore = createMobxPersistedStore("onboarding_state", {
  closedFlags: [] as string[],
});

export function getWasOnboardingTipSeen(id: string) {
  return computed(() => onboardingStateStore.closedFlags.includes(id)).get();
}

export function markOnboardingTipAsSeen(id: string) {
  runInAction(() => {
    if (getWasOnboardingTipSeen(id)) return;

    onboardingStateStore.closedFlags.push(id);
  });
}
