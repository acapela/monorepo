import { autorun, makeAutoObservable } from "mobx";

import {
  authTokenBridgeValue,
  figmaAuthTokenBridgeValue,
  linearAuthTokenBridgeValue,
  notionAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";

import { accountStore } from "./account";

/**
 * Store responsible for keeping information about current onboarding.
 */

export const onboardingStore = makeAutoObservable({
  get isReady() {
    return authTokenBridgeValue.isReady;
  },

  // TODO: Figure out how the hell this scales. Feels super hacky and unscalable
  get linkedAppsStatus(): { isReady: boolean; hasLinkedApps?: boolean } {
    const user = accountStore.user;

    const notion = notionAuthTokenBridgeValue;
    const figma = figmaAuthTokenBridgeValue;
    const linear = linearAuthTokenBridgeValue;

    if (!user || !notion.isReady || !figma.isReady || !linear.isReady) {
      return { isReady: false };
    }

    const hasLinkedApps = [notion.get(), figma.get(), linear.get(), user.has_slack_installation].some((t) => !!t);

    return {
      isReady: true,
      hasLinkedApps,
    };
  },

  onboardingStatus: "unknown" as "unknown" | "ongoing" | "complete",
});

autorun(() => {
  const { onboardingStatus: isOnboarding, linkedAppsStatus } = onboardingStore;

  if (linkedAppsStatus.isReady && !linkedAppsStatus.hasLinkedApps && isOnboarding === null) {
    onboardingStore.onboardingStatus = "ongoing";
  }
});
